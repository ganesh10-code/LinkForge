package com.url.shortner.service;

import com.url.shortner.models.ClickEvent;
import com.url.shortner.models.UrlMapping;
import com.url.shortner.repository.ClickEventRepository;
import com.url.shortner.repository.UrlMappingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ClickAnalyticsService {

    @Autowired
    private UrlMappingRepository urlMappingRepository;

    @Autowired
    private ClickEventRepository clickEventRepository;

    @Async("analyticsExecutor")
    @Transactional
    public void recordClick(Long urlMappingId, LocalDateTime clickTime) {
        try {
            // Atomic click count update (avoids SELECT)
            urlMappingRepository.incrementClickCount(urlMappingId);

            // Record Click event
            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setClickDate(clickTime);
            
            // getReferenceById avoids an immediate SELECT by providing a proxy
            UrlMapping proxy = urlMappingRepository.getReferenceById(urlMappingId);
            clickEvent.setUrlMapping(proxy);
            
            clickEventRepository.save(clickEvent);
            
        } catch (Exception e) {
            // Silently log persistence failures to prevent propagating exceptions out of the async boundary.
            // The redirect has already happened, so we can't notify the user. 
            System.err.println("Failed to asynchronously persist click analytics for UrlMapping ID " + urlMappingId + ": " + e.getMessage());
        }
    }
}
