package com.letgoo.service;

import com.letgoo.dto.PlaceDto;
import com.letgoo.exception.ResourceNotFoundException;
import com.letgoo.model.Place;
import com.letgoo.repository.PlaceRepository;
import com.letgoo.repository.WeekPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final WeekPlanRepository weekPlanRepository;

    @Transactional(readOnly = true)
    public List<PlaceDto> getAllPlaces() {
        List<Place> places = placeRepository.findAllByOrderByCreatedAtAsc();
        List<PlaceDto> dtos = new java.util.ArrayList<>();
        int unvisitedCount = 0;
        for (Place place : places) {
            PlaceDto dto = PlaceDto.fromEntity(place);
            if (!"visited".equalsIgnoreCase(place.getStatus())) {
                unvisitedCount++;
                dto.setStt(unvisitedCount);
            } else {
                dto.setStt(null);
            }
            dtos.add(dto);
        }
        return dtos;
    }

    @Transactional(readOnly = true)
    public PlaceDto getPlaceById(String id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa điểm: " + id));
        PlaceDto dto = PlaceDto.fromEntity(place);
        if ("visited".equalsIgnoreCase(place.getStatus())) {
            dto.setStt(null);
            return dto;
        }

        List<Place> allPlaces = placeRepository.findAllByOrderByCreatedAtAsc();
        int count = 0;
        for (Place p : allPlaces) {
            if (!"visited".equalsIgnoreCase(p.getStatus())) {
                count++;
                if (p.getId().equals(id)) {
                    dto.setStt(count);
                    break;
                }
            }
        }
        return dto;
    }

    @Transactional
    public PlaceDto createPlace(PlaceDto dto) {
        if (dto.getId() == null || dto.getId().trim().isEmpty()) {
            dto.setId("place-" + System.currentTimeMillis());
        }

        Place entity = dto.toEntity();
        Place saved = placeRepository.save(entity);
        log.info("Created new place: {} with id: {}", saved.getTitle(), saved.getId());
        PlaceDto res = PlaceDto.fromEntity(saved);
        res.setStt((int) placeRepository.count());
        return res;
    }

    @Transactional
    public PlaceDto updatePlace(String id, PlaceDto dto) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa điểm: " + id));

        if (dto.getTitle() != null) place.setTitle(dto.getTitle());
        if (dto.getLocation() != null) place.setLocation(dto.getLocation());
        if (dto.getCategory() != null) place.setCategory(dto.getCategory());
        if (dto.getCategoryLabel() != null) place.setCategoryLabel(dto.getCategoryLabel());
        if (dto.getPriceRange() != null) place.setPriceRange(dto.getPriceRange());
        if (dto.getPriceText() != null) place.setPriceText(dto.getPriceText());
        if (dto.getStatus() != null) place.setStatus(dto.getStatus());
        if (dto.getRating() != null) place.setRating(dto.getRating());
        if (dto.getReviewNote() != null) place.setReviewNote(dto.getReviewNote());
        if (dto.getImageUrl() != null) place.setImageUrl(dto.getImageUrl());
        if (dto.getSourceLink() != null) place.setSourceLink(dto.getSourceLink());
        if (dto.getSuggestedWeek() != null) place.setSuggestedWeek(dto.getSuggestedWeek());
        if (dto.getScheduledDate() != null) place.setScheduledDate(dto.getScheduledDate());
        if (dto.getScheduledDayName() != null) place.setScheduledDayName(dto.getScheduledDayName());
        if (dto.getVisitedDate() != null) place.setVisitedDate(dto.getVisitedDate());

        if (dto.getMapCoords() != null && dto.getMapCoords().size() >= 2) {
            place.setLat(dto.getMapCoords().get(0));
            place.setLng(dto.getMapCoords().get(1));
        }

        if (dto.getTags() != null) {
            place.setTags(String.join(", ", dto.getTags()));
        }

        Place updated = placeRepository.save(place);
        return PlaceDto.fromEntity(updated);
    }

    @Transactional
    public void deletePlace(String id) {
        if (!placeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy địa điểm: " + id);
        }
        weekPlanRepository.deleteByPlaceId(id);
        placeRepository.deleteById(id);
        log.info("Deleted place: {}", id);
    }

    @Transactional
    public PlaceDto changeStatus(String id, String newStatus, String scheduledDate, String scheduledDayName) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa điểm: " + id));

        place.setStatus(newStatus);
        if ("scheduled".equals(newStatus)) {
            if (scheduledDate != null) place.setScheduledDate(scheduledDate);
            if (scheduledDayName != null) place.setScheduledDayName(scheduledDayName);
        } else if ("visited".equals(newStatus)) {
            place.setSuggestedWeek(false);
            place.setScheduledDate(null);
            place.setScheduledDayName(null);
            weekPlanRepository.deleteByPlaceId(id);
            if (place.getVisitedDate() == null) {
                place.setVisitedDate(LocalDate.now().toString());
            }
        }

        Place updated = placeRepository.save(place);
        return PlaceDto.fromEntity(updated);
    }

    @Transactional
    public PlaceDto toggleVote(String id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa điểm: " + id));

        int currentVotes = place.getVotes() != null ? place.getVotes() : 0;
        place.setVotes(currentVotes + 1);

        Place updated = placeRepository.save(place);
        return PlaceDto.fromEntity(updated);
    }
}
