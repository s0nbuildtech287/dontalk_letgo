package com.letgoo.service;

import com.letgoo.model.WeekPlan;
import com.letgoo.repository.WeekPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlanService {

    private final WeekPlanRepository weekPlanRepository;
    private final PlaceService placeService;

    private static final List<String> DAYS = Arrays.asList(
            "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"
    );

    @Transactional(readOnly = true)
    public Map<String, List<String>> getWeekPlans() {
        Map<String, List<String>> result = new LinkedHashMap<>();
        for (String day : DAYS) {
            result.put(day, new ArrayList<>());
        }

        List<WeekPlan> all = weekPlanRepository.findAllByOrderByOrderIndexAsc();
        for (WeekPlan wp : all) {
            if (result.containsKey(wp.getDayName())) {
                result.get(wp.getDayName()).add(wp.getPlaceId());
            } else {
                result.computeIfAbsent(wp.getDayName(), k -> new ArrayList<>()).add(wp.getPlaceId());
            }
        }

        return result;
    }

    @Transactional
    public Map<String, List<String>> assignToDay(String placeId, String dayName) {
        if (!weekPlanRepository.existsByPlaceIdAndDayName(placeId, dayName)) {
            WeekPlan plan = WeekPlan.builder()
                    .placeId(placeId)
                    .dayName(dayName)
                    .orderIndex((int) weekPlanRepository.count())
                    .build();
            weekPlanRepository.save(plan);
        }

        // Also update place status to scheduled
        placeService.changeStatus(placeId, "scheduled", null, dayName);

        return getWeekPlans();
    }

    @Transactional
    public Map<String, List<String>> removeFromDay(String placeId, String dayName) {
        weekPlanRepository.deleteByPlaceIdAndDayName(placeId, dayName);
        return getWeekPlans();
    }
}
