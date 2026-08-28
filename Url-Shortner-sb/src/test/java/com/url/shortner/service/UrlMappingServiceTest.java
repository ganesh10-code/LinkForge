package com.url.shortner.service;

import com.url.shortner.dtos.UrlMappingDTO;
import com.url.shortner.dtos.UrlRedirectCache;
import com.url.shortner.exceptions.DuplicateAliasException;
import com.url.shortner.exceptions.UrlExpiredException;
import com.url.shortner.models.UrlMapping;
import com.url.shortner.models.User;
import com.url.shortner.repository.ClickEventRepository;
import com.url.shortner.repository.UrlMappingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UrlMappingServiceTest {

    @Mock
    private UrlMappingRepository urlMappingRepository;

    @Mock
    private ClickEventRepository clickEventRepository;

    @Mock
    private ClickAnalyticsService clickAnalyticsService;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private UrlMappingService urlMappingService;

    private User testUser;
    private Clock fixedClock;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        // Fix clock to "2026-08-28T12:00:00Z"
        fixedClock = Clock.fixed(Instant.parse("2026-08-28T12:00:00Z"), ZoneId.of("UTC"));
        urlMappingService.setClock(fixedClock);
        ReflectionTestUtils.setField(urlMappingService, "defaultTtlDays", 7L);
    }

    @Test
    void testCreateShortUrl_WithoutAlias_GeneratesRandom() {
        when(urlMappingRepository.save(any(UrlMapping.class))).thenAnswer(i -> {
            UrlMapping mapping = i.getArgument(0);
            mapping.setId(1L);
            return mapping;
        });

        UrlMappingDTO result = urlMappingService.createShortUrl("https://example.com", null, null, testUser);

        assertNotNull(result.getShortUrl());
        assertEquals(8, result.getShortUrl().length());
        assertNull(result.getExpiresAt());
        verify(urlMappingRepository, times(1)).save(any(UrlMapping.class));
    }

    @Test
    void testCreateShortUrl_WithValidAlias() {
        when(urlMappingRepository.save(any(UrlMapping.class))).thenAnswer(i -> {
            UrlMapping mapping = i.getArgument(0);
            mapping.setId(1L);
            return mapping;
        });

        UrlMappingDTO result = urlMappingService.createShortUrl("https://example.com", "my-alias", null, testUser);

        assertEquals("my-alias", result.getShortUrl());
        assertNull(result.getExpiresAt());
        verify(urlMappingRepository, times(1)).save(any(UrlMapping.class));
    }

    @Test
    void testCreateShortUrl_DuplicateAlias_ThrowsException() {
        when(urlMappingRepository.save(any(UrlMapping.class))).thenThrow(new DataIntegrityViolationException("Duplicate"));

        assertThrows(DuplicateAliasException.class, () -> {
            urlMappingService.createShortUrl("https://example.com", "duplicate-alias", null, testUser);
        });
    }

    @Test
    void testGetOriginalUrl_CacheHit_NotExpired() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        UrlRedirectCache cacheValue = new UrlRedirectCache(1L, "my-link", "https://example.com", null);
        when(valueOperations.get("url:my-link")).thenReturn(cacheValue);

        String originalUrl = urlMappingService.getOriginalUrl("my-link");
        
        assertEquals("https://example.com", originalUrl);
        // DB lookup should NOT be called
        verify(urlMappingRepository, never()).findByShortUrl(anyString());
        // Verify async analytics were triggered
        verify(clickAnalyticsService, times(1)).recordClick(eq(1L), any(LocalDateTime.class));
    }

    @Test
    void testGetOriginalUrl_CacheHit_Expired() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        UrlRedirectCache cacheValue = new UrlRedirectCache(1L, "my-link", "https://example.com", LocalDateTime.parse("2026-08-01T12:00:00"));
        when(valueOperations.get("url:my-link")).thenReturn(cacheValue);

        assertThrows(UrlExpiredException.class, () -> {
            urlMappingService.getOriginalUrl("my-link");
        });

        // Cache eviction should be triggered
        verify(redisTemplate, times(1)).delete("url:my-link");
        verify(urlMappingRepository, never()).findByShortUrl(anyString());
        verify(clickAnalyticsService, never()).recordClick(anyLong(), any());
    }

    @Test
    void testGetOriginalUrl_CacheMiss_Valid_PopulatesCache() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("url:my-link")).thenReturn(null);
        
        UrlMapping mapping = new UrlMapping();
        mapping.setId(1L);
        mapping.setShortUrl("my-link");
        mapping.setOriginalUrl("https://example.com");
        mapping.setExpiresAt(LocalDateTime.parse("2026-09-01T12:00:00"));

        when(urlMappingRepository.findByShortUrl("my-link")).thenReturn(mapping);

        String originalUrl = urlMappingService.getOriginalUrl("my-link");
        
        assertEquals("https://example.com", originalUrl);
        verify(urlMappingRepository, times(1)).findByShortUrl("my-link");
        // Verify it was cached with TTL
        verify(valueOperations, times(1)).set(eq("url:my-link"), any(UrlRedirectCache.class), any(Duration.class));
        verify(clickAnalyticsService, times(1)).recordClick(eq(1L), any(LocalDateTime.class));
    }

    @Test
    void testGetOriginalUrl_RedisDown_FallbackToDb() {
        when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("Redis is down"));
        
        UrlMapping mapping = new UrlMapping();
        mapping.setId(1L);
        mapping.setShortUrl("my-link");
        mapping.setOriginalUrl("https://example.com");

        when(urlMappingRepository.findByShortUrl("my-link")).thenReturn(mapping);

        String originalUrl = urlMappingService.getOriginalUrl("my-link");
        
        // It gracefully handles failure and falls back
        assertEquals("https://example.com", originalUrl);
        verify(urlMappingRepository, times(1)).findByShortUrl("my-link");
        verify(clickAnalyticsService, times(1)).recordClick(eq(1L), any(LocalDateTime.class));
    }

    @Test
    void testDeleteUrlMapping_EvictsCache() {
        UrlMapping mapping = new UrlMapping();
        mapping.setShortUrl("my-link");
        mapping.setUser(testUser);
        
        when(urlMappingRepository.findByShortUrl("my-link")).thenReturn(mapping);

        urlMappingService.deleteUrlMapping("my-link", testUser);
        
        verify(urlMappingRepository, times(1)).delete(mapping);
        verify(redisTemplate, times(1)).delete("url:my-link");
    }
}
