package com.url.shortner.dtos;

import java.time.LocalDateTime;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UrlMappingDTO {

    private Long id;

    @NotBlank(message = "Original URL cannot be blank")
    private String originalUrl;

    @NotBlank(message = "Short URL cannot be blank")
    private String shortUrl;

    @Min(value = 0, message = "Click count cannot be negative")
    private int clickCount;

    @PastOrPresent(message = "Created date cannot be in the future")
    private LocalDateTime createdDate;

    private LocalDateTime expiresAt;

    @NotBlank(message = "Username cannot be blank")
    private String username;
}
