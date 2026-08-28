package com.url.shortner.service;

import com.url.shortner.dtos.ClickEventDTO;
import com.url.shortner.dtos.UrlMappingDTO;
import com.url.shortner.exceptions.DuplicateAliasException;
import com.url.shortner.models.ClickEvent;
import com.url.shortner.models.UrlMapping;
import com.url.shortner.models.User;
import com.url.shortner.repository.ClickEventRepository;
import com.url.shortner.repository.UrlMappingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Clock;
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

    // Generate a random 8-character alphanumeric string
    private String generateShortUrl1() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        Random random = new Random();
        StringBuilder shortUrl = new StringBuilder(8);

        for(int i = 0;i < 8 ; i++){
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
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

    // Retrieve original URL and increment click count
    public UrlMapping getOriginalUrl(String shortUrl) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if(urlMapping != null){
            if (isExpired(urlMapping)) {
                throw new com.url.shortner.exceptions.UrlExpiredException("The short URL has expired.");
            }

            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);

            // record Click event

            ClickEvent clickEvent =  new ClickEvent();
            clickEvent.setClickDate(LocalDateTime.now(clock));
            clickEvent.setUrlMapping(urlMapping);
            clickEventRepository.save(clickEvent);
        }
        return urlMapping;
    }

    // Check if the URL has expired
    public boolean isExpired(UrlMapping urlMapping) {
        if (urlMapping.getExpiresAt() == null) {
            return false;
        }
        return urlMapping.getExpiresAt().isBefore(LocalDateTime.now(clock));
    }

    // Delete URL mapping along with its click events
    @Transactional  // Ensure all deletions happen in a single transaction
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
    }

    // Update the original URL for a given short URL
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
        return convertToDto(urlMapping);
    }
}
