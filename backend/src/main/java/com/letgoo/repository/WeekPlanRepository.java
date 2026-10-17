package com.letgoo.repository;

import com.letgoo.model.WeekPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeekPlanRepository extends JpaRepository<WeekPlan, Long> {
    List<WeekPlan> findAllByOrderByOrderIndexAsc();
    List<WeekPlan> findByDayName(String dayName);
    void deleteByPlaceId(String placeId);
    void deleteByPlaceIdAndDayName(String placeId, String dayName);
    boolean existsByPlaceIdAndDayName(String placeId, String dayName);
}
