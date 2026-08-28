package com.url.shortner.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Value("${ASYNC_CORE_POOL_SIZE:2}")
    private int corePoolSize;

    @Value("${ASYNC_MAX_POOL_SIZE:10}")
    private int maxPoolSize;

    @Value("${ASYNC_QUEUE_CAPACITY:10000}")
    private int queueCapacity;

    @Bean(name = "analyticsExecutor")
    public Executor analyticsExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setThreadNamePrefix("analytics-");
        
        // Use a DiscardPolicy with logging wrapper, or default DiscardPolicy.
        // The request thread should never block waiting for analytics.
        executor.setRejectedExecutionHandler((r, executor1) -> {
            System.err.println("Analytics executor queue saturated. Dropping click event to protect redirect thread.");
        });
        
        executor.initialize();
        return executor;
    }
}
