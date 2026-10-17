package com.letgoo.service;

import com.letgoo.exception.ResourceNotFoundException;
import com.letgoo.model.JournalEntry;
import com.letgoo.repository.JournalEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class JournalService {

    private final JournalEntryRepository journalEntryRepository;

    @Transactional(readOnly = true)
    public List<JournalEntry> getAllEntries() {
        return journalEntryRepository.findAllByOrderByVisitedDateDesc();
    }

    @Transactional
    public JournalEntry createEntry(JournalEntry entry) {
        return journalEntryRepository.save(entry);
    }

    @Transactional
    public void deleteEntry(Long id) {
        if (!journalEntryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy nhật ký: " + id);
        }
        journalEntryRepository.deleteById(id);
    }
}
