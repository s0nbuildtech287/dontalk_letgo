package com.letgoo.repository;

import com.letgoo.model.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findAllByOrderByVisitedDateDesc();
    List<JournalEntry> findByPlaceId(String placeId);
}
