package com.url.shortner.service;

import com.url.shortner.dtos.ClickEventDTO;
import com.url.shortner.dtos.UrlMappingDTO;
import com.url.shortner.dtos.UrlRedirectCache;
import com.url.shortner.exceptions.DuplicateAliasException;
import com.url.shortner.exceptions.UrlExpiredException;
import com.url.shortner.models.ClickEvent;
import com.url.shortner.models.UrlMapping;
import com.url.shortner.models.User;
import com.url.shortner.repository.ClickEventRepository;
import com.url.shortner.repository.UrlMappingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UrlMappingService {

    @Autowired
    private UrlMappingRepository urlMappingRepository;

    @Autowired
    private ClickEventRepository clickEventRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ClickAnalyticsService clickAnalyticsService;

    @Value("${REDIS_DEFAULT_TTL_DAYS:7}")
    private long defaultTtlDays;

    private Clock clock = Clock.systemUTC();

    public void setClock(Clock clock) {
        this.clock = clock;
    }

    private static final List<String> RESERVED_ALIASES = Arrays.asList("api", "login", "register", "health", "dashboard", "urls", "shorten");
    private static final Pattern ALIAS_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]+$");

    // Create a short URL for the given original URL and user (with optional custom alias and expiration)
    public UrlMappingDTO createShortUrl(String originalUrl, String customAlias, String expiresAtStr, User user) {
        String shortUrl;

        if (customAlias != null && !customAlias.trim().isEmpty()) {
            shortUrl = customAlias.trim();
            validateCustomAlias(shortUrl);
        } else {
            shortUrl = generateShortUrl();
        }

        LocalDateTime expiresAt = null;
        if (expiresAtStr != null && !expiresAtStr.trim().isEmpty()) {
            try {
                Instant instant = Instant.parse(expiresAtStr);
                expiresAt = LocalDateTime.ofInstant(instant, ZoneId.of("UTC"));
                if (expiresAt.isBefore(LocalDateTime.now(clock))) {
                    throw new IllegalArgumentException("Expiration time must be in the future.");
                }
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid expiration date format. Use ISO-8601 (e.g., 2026-09-01T18:30:00Z).");
            }
        }

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedDate(LocalDateTime.now(clock));
        urlMapping.setExpiresAt(expiresAt);

        try {
            UrlMapping savedUrlMapping = urlMappingRepository.save(urlMapping);
            return convertToDto(savedUrlMapping);
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateAliasException("The alias '" + shortUrl + "' is already in use.");
        }
    }

    private void validateCustomAlias(String alias) {
        if (alias.length() > 50) {
            throw new IllegalArgumentException("Custom alias cannot exceed 50 characters.");
        }
        if (!ALIAS_PATTERN.matcher(alias).matches()) {
            throw new IllegalArgumentException("Custom alias can only contain letters, numbers, hyphens, and underscores.");
        }
        if (RESERVED_ALIASES.contains(alias.toLowerCase())) {
            throw new IllegalArgumentException("The alias '" + alias + "' is reserved and cannot be used.");
        }
    }

    private String generateShortUrl() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        String shortUrl;

        do {
            StringBuilder sb = new StringBuilder(8);
            for (int i = 0; i < 8; i++) {
                sb.append(characters.charAt(random.nextInt(characters.length())));
            }
            shortUrl = sb.toString();
        } while (urlMappingRepository.existsByShortUrl(shortUrl));

        return shortUrl;
    }

    // Convert UrlMapping entity to UrlMappingDTO
    private UrlMappingDTO convertToDto(UrlMapping urlMapping){
        UrlMappingDTO urlMappingDTO = new UrlMappingDTO();
        urlMappingDTO.setId(urlMapping.getId());
        urlMappingDTO.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDTO.setShortUrl(urlMapping.getShortUrl());
        urlMappingDTO.setClickCount(urlMapping.getClickCount());
        urlMappingDTO.setCreatedDate(urlMapping.getCreatedDate());
        urlMappingDTO.setExpiresAt(urlMapping.getExpiresAt());
        urlMappingDTO.setUsername(urlMapping.getUser().getUsername());
        return urlMappingDTO;
    }

    // Get all URLs for a specific user
    public List<UrlMappingDTO> getUrlsByUser(User user) {
        return urlMappingRepository.findByUser(user).stream().map(this::convertToDto).toList();
    }

    // Get click events for a specific short URL in a date range
    public List<ClickEventDTO> getClickEventsByDate(String shortUrl, LocalDateTime start, LocalDateTime end) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if(urlMapping != null){
            return clickEventRepository.findByUrlMappingAndClickDateBetween(urlMapping , start , end)
                    .stream().collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(),Collectors.counting()))
                    .entrySet().stream()
                    .map(entry ->
                    {
                        ClickEventDTO clickEventDTO = new ClickEventDTO();
                        clickEventDTO.setClickDate(entry.getKey());
                        clickEventDTO.setCount(entry.getValue());
                        return clickEventDTO;
                    })
                    .collect(Collectors.toList());
        }
        return  null;
    }

    // Get total clicks for a user in a date range
    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate start, LocalDate end) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingInAndClickDateBetween(urlMappings , start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        return clickEvents.stream().collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()));
    }

    // Retrieve original URL (via Redis or DB) and asynchronously record click
    public String getOriginalUrl(String shortUrl) {
        String cacheKey = "url:" + shortUrl;
        UrlRedirectCache cacheValue = null;

        // Redis GET with graceful degradation
        try {
            cacheValue = (UrlRedirectCache) redisTemplate.opsForValue().get(cacheKey);
        } catch (Exception e) {
            System.err.println("Redis GET failed for key " + cacheKey + ": " + e.getMessage());
        }

        if (cacheValue != null) {
            // Cache HIT
            if (isExpiredCache(cacheValue)) {
                evictCache(cacheKey);
                throw new UrlExpiredException("The short URL has expired.");
            }
            // Fire-and-forget async analytics
            clickAnalyticsService.recordClick(cacheValue.getId(), LocalDateTime.now(clock));
            return cacheValue.getOriginalUrl();
        }

        // Cache MISS - PostgreSQL fallback
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            if (isExpired(urlMapping)) {
                throw new UrlExpiredException("The short URL has expired.");
            }
            populateCache(cacheKey, urlMapping);
            
            // Fire-and-forget async analytics
            clickAnalyticsService.recordClick(urlMapping.getId(), LocalDateTime.now(clock));
            return urlMapping.getOriginalUrl();
        }

        return null; // Triggers 404 in controller
    }

    private void populateCache(String cacheKey, UrlMapping urlMapping) {
        UrlRedirectCache dto = new UrlRedirectCache(
                urlMapping.getId(),
                urlMapping.getShortUrl(),
                urlMapping.getOriginalUrl(),
                urlMapping.getExpiresAt()
        );

        Duration ttl = (urlMapping.getExpiresAt() != null)
                ? Duration.between(LocalDateTime.now(clock), urlMapping.getExpiresAt())
                : Duration.ofDays(defaultTtlDays);

        if (ttl.isNegative() || ttl.isZero()) return;

        try {
            redisTemplate.opsForValue().set(cacheKey, dto, ttl);
        } catch (Exception e) {
            System.err.println("Redis SET failed for key " + cacheKey + ": " + e.getMessage());
        }
    }

    private void evictCache(String cacheKey) {
        try {
            redisTemplate.delete(cacheKey);
        } catch (Exception e) {
            System.err.println("Redis DELETE failed for key " + cacheKey + ". Stale cache risk exists. Exception: " + e.getMessage());
        }
    }

    // Check if the URL mapping entity has expired
    public boolean isExpired(UrlMapping urlMapping) {
        if (urlMapping.getExpiresAt() == null) {
            return false;
        }
        return urlMapping.getExpiresAt().isBefore(LocalDateTime.now(clock));
    }

    // Check if the cached DTO has expired
    private boolean isExpiredCache(UrlRedirectCache cacheValue) {
        if (cacheValue.getExpiresAt() == null) {
            return false;
        }
        return cacheValue.getExpiresAt().isBefore(LocalDateTime.now(clock));
    }

    // Delete URL mapping along with its click events
    @Transactional
    public void deleteUrlMapping(String shortUrl, User user) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);

        if (urlMapping == null) {
            throw new NoSuchElementException("URL mapping not found");
        }

        if (urlMapping.getUser().getId() != user.getId()) {
            throw new SecurityException("You don't have permission to delete this URL");
        }

        // Delete all click events related to this URL
        clickEventRepository.deleteByUrlMapping(urlMapping);

        // Delete the URL mapping itself
        urlMappingRepository.delete(urlMapping);

        // Cache Invalidation
        evictCache("url:" + shortUrl);
    }

    // Update the original URL for a given short URL
    @Transactional
    public UrlMappingDTO updateOriginalUrl(String shortUrl, String newOriginalUrl, User user) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);

        if (urlMapping == null) {
            throw new NoSuchElementException("URL mapping not found");
        }

        if (urlMapping.getUser().getId() != user.getId()) {
            throw new SecurityException("You don't have permission to update this URL");
        }

        urlMapping.setOriginalUrl(newOriginalUrl);
        urlMappingRepository.save(urlMapping);

        // Cache Invalidation
        evictCache("url:" + shortUrl);

        return convertToDto(urlMapping);
    }
}
