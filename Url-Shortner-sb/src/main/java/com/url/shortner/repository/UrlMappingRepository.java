package com.url.shortner.repository;

import com.url.shortner.models.UrlMapping;
import com.url.shortner.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping , Long>{
    UrlMapping findByShortUrl(String shortUrl);
    List<UrlMapping> findByUser(User user);
    boolean existsByShortUrl(String shortUrl);
}
