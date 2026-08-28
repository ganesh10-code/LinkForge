package com.url.shortner.service;

import com.url.shortner.dtos.UrlMappingDTO;
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

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UrlMappingServiceTest {

    @Mock
    private UrlMappingRepository urlMappingRepository;

    @Mock
    private ClickEventRepository clickEventRepository;

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
    void testCreateShortUrl_WithFutureExpiration() {
        when(urlMappingRepository.save(any(UrlMapping.class))).thenAnswer(i -> {
            UrlMapping mapping = i.getArgument(0);
            mapping.setId(1L);
            return mapping;
        });

        UrlMappingDTO result = urlMappingService.createShortUrl("https://example.com", null, "2026-09-01T12:00:00Z", testUser);

        assertNotNull(result.getExpiresAt());
        assertEquals(LocalDateTime.parse("2026-09-01T12:00:00"), result.getExpiresAt());
    }

    @Test
    void testCreateShortUrl_WithPastExpiration_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            urlMappingService.createShortUrl("https://example.com", null, "2025-01-01T12:00:00Z", testUser);
        });
    }

    @Test
    void testCreateShortUrl_InvalidExpirationFormat_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            urlMappingService.createShortUrl("https://example.com", null, "not-a-date", testUser);
        });
    }

    @Test
    void testCreateShortUrl_DuplicateAlias_ThrowsException() {
        when(urlMappingRepository.save(any(UrlMapping.class))).thenThrow(new DataIntegrityViolationException("Duplicate"));

        assertThrows(DuplicateAliasException.class, () -> {
            urlMappingService.createShortUrl("https://example.com", "duplicate-alias", null, testUser);
        });
    }

    @Test
    void testCreateShortUrl_InvalidAlias_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            urlMappingService.createShortUrl("https://example.com", "invalid alias with space", null, testUser);
        });
    }

    @Test
    void testGetOriginalUrl_NotExpired() {
        UrlMapping mapping = new UrlMapping();
        mapping.setShortUrl("my-link");
        mapping.setOriginalUrl("https://example.com");
        mapping.setExpiresAt(LocalDateTime.parse("2026-09-01T12:00:00"));

        when(urlMappingRepository.findByShortUrl("my-link")).thenReturn(mapping);

        UrlMapping result = urlMappingService.getOriginalUrl("my-link");
        assertEquals("https://example.com", result.getOriginalUrl());
    }

    @Test
    void testGetOriginalUrl_Expired() {
        UrlMapping mapping = new UrlMapping();
        mapping.setShortUrl("my-link");
        mapping.setOriginalUrl("https://example.com");
        // Expired relative to 2026-08-28
        mapping.setExpiresAt(LocalDateTime.parse("2026-08-01T12:00:00"));

        when(urlMappingRepository.findByShortUrl("my-link")).thenReturn(mapping);

        assertThrows(UrlExpiredException.class, () -> {
            urlMappingService.getOriginalUrl("my-link");
        });
    }
}
