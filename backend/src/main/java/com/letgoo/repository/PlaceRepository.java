package com.letgoo.repository;

import com.letgoo.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, String> {
    List<Place> findAllByOrderByCreatedAtDesc();
    List<Place> findByStatus(String status);
    List<Place> findByCategory(String category);
}
