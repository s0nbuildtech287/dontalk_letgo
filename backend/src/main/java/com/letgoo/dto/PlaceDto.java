package com.letgoo.dto;

import com.letgoo.model.Place;
import lombok.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceDto {
    private String id;
    private String title;
    private String location;
    private String category;
    private String categoryLabel;
    private String priceRange;
    private String priceText;
    private String status;
    private Integer savedDaysAgo;
    private Double rating;
    private String reviewNote;
    private String imageUrl;
    private String driveFileId;
    private List<Double> mapCoords; // [lat, lng]
    private Integer votes;
    private String sourceLink;
    private List<String> tags;
    private Boolean suggestedWeek;
    private String scheduledDate;
    private String scheduledDayName;
    private String visitedDate;

    public static PlaceDto fromEntity(Place entity) {
        if (entity == null) return null;

        List<Double> coords = new ArrayList<>();
        if (entity.getLat() != null && entity.getLng() != null) {
            coords.add(entity.getLat());
            coords.add(entity.getLng());
        } else {
            coords.add(10.7769);
            coords.add(106.7009);
        }

        List<String> tagList = new ArrayList<>();
        if (entity.getTags() != null && !entity.getTags().trim().isEmpty()) {
            tagList = Arrays.stream(entity.getTags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        return PlaceDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .location(entity.getLocation())
                .category(entity.getCategory())
                .categoryLabel(entity.getCategoryLabel())
                .priceRange(entity.getPriceRange())
                .priceText(entity.getPriceText())
                .status(entity.getStatus())
                .savedDaysAgo(entity.getSavedDaysAgo())
                .rating(entity.getRating())
                .reviewNote(entity.getReviewNote())
                .imageUrl(entity.getImageUrl())
                .driveFileId(entity.getDriveFileId())
                .mapCoords(coords)
                .votes(entity.getVotes())
                .sourceLink(entity.getSourceLink())
                .tags(tagList)
                .suggestedWeek(entity.getSuggestedWeek())
                .scheduledDate(entity.getScheduledDate())
                .scheduledDayName(entity.getScheduledDayName())
                .visitedDate(entity.getVisitedDate())
                .build();
    }

    public Place toEntity() {
        Double latitude = (mapCoords != null && mapCoords.size() >= 2) ? mapCoords.get(0) : 10.7769;
        Double longitude = (mapCoords != null && mapCoords.size() >= 2) ? mapCoords.get(1) : 106.7009;
        String tagsJoined = (tags != null) ? String.join(", ", tags) : "";

        return Place.builder()
                .id(id != null ? id : "place-" + System.currentTimeMillis())
                .title(title)
                .location(location)
                .category(category != null ? category : "an")
                .categoryLabel(categoryLabel != null ? categoryLabel : "Ăn ngon")
                .priceRange(priceRange != null ? priceRange : "$$")
                .priceText(priceText != null ? priceText : "50k - 100k")
                .status(status != null ? status : "want")
                .savedDaysAgo(savedDaysAgo != null ? savedDaysAgo : 0)
                .rating(rating != null ? rating : 4.5)
                .reviewNote(reviewNote)
                .imageUrl(imageUrl)
                .driveFileId(driveFileId)
                .lat(latitude)
                .lng(longitude)
                .votes(votes != null ? votes : 1)
                .sourceLink(sourceLink)
                .tags(tagsJoined)
                .suggestedWeek(suggestedWeek != null ? suggestedWeek : false)
                .scheduledDate(scheduledDate)
                .scheduledDayName(scheduledDayName)
                .visitedDate(visitedDate)
                .build();
    }
}
