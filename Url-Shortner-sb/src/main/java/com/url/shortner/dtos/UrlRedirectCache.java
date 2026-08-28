package com.url.shortner.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UrlRedirectCache {
    private Long id;
    private String shortUrl;
    private String originalUrl;
    private LocalDateTime expiresAt;
}
