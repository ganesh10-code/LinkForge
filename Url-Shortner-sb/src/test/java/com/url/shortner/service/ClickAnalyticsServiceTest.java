package com.url.shortner.service;

import com.url.shortner.models.ClickEvent;
import com.url.shortner.models.UrlMapping;
import com.url.shortner.repository.ClickEventRepository;
import com.url.shortner.repository.UrlMappingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClickAnalyticsServiceTest {

    @Mock
    private UrlMappingRepository urlMappingRepository;

    @Mock
    private ClickEventRepository clickEventRepository;

    @InjectMocks
    private ClickAnalyticsService clickAnalyticsService;

    @Test
    void testRecordClick_SuccessfulPersistence() {
        Long urlId = 1L;
        LocalDateTime clickTime = LocalDateTime.parse("2026-08-28T12:00:00");
        
        UrlMapping proxy = new UrlMapping();
        proxy.setId(urlId);

        when(urlMappingRepository.getReferenceById(urlId)).thenReturn(proxy);

        clickAnalyticsService.recordClick(urlId, clickTime);

        verify(urlMappingRepository, times(1)).incrementClickCount(urlId);
        verify(clickEventRepository, times(1)).save(any(ClickEvent.class));
    }

    @Test
    void testRecordClick_HandlesExceptionSilently() {
        Long urlId = 1L;
        LocalDateTime clickTime = LocalDateTime.parse("2026-08-28T12:00:00");

        // Simulate DB failure on click count increment
        doThrow(new RuntimeException("DB Connection Timeout")).when(urlMappingRepository).incrementClickCount(urlId);

        // This should NOT throw an exception back to the caller since we swallow it in try-catch
        clickAnalyticsService.recordClick(urlId, clickTime);

        verify(urlMappingRepository, times(1)).incrementClickCount(urlId);
        // The save should never be called because the previous line threw an exception inside the try block
        verify(clickEventRepository, never()).save(any(ClickEvent.class));
    }
}
