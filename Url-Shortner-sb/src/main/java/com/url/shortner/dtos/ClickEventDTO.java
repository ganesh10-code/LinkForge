package com.url.shortner.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClickEventDTO {

    @NotNull(message = "Click date cannot be null")
    private LocalDate clickDate;

    @NotNull(message = "Count cannot be null")
    @Min(value = 0, message = "Count must be zero or positive")
    private Long count;
}
