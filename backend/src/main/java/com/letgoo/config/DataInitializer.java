package com.letgoo.config;

import com.letgoo.model.Place;
import com.letgoo.model.User;
import com.letgoo.model.WeekPlan;
import com.letgoo.repository.PlaceRepository;
import com.letgoo.repository.UserRepository;
import com.letgoo.repository.WeekPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PlaceRepository placeRepository;
    private final WeekPlanRepository weekPlanRepository;

    @Override
    public void run(String... args) {
        seedUsers();
        // Do not seed mock places or plans so user can start fresh
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            log.info("Seeding default users into PostgreSQL...");
            userRepository.saveAll(List.of(
                    User.builder()
                            .username("xu4ns0n")
                            .password("123")
                            .name("Xuân Sơn")
                            .gender("male")
                            .role("Captain")
                            .avatarText("S")
                            .avatarBg("from-amber-400 to-[#FF6B4A]")
                            .build(),
                    User.builder()
                            .username("maihuong")
                            .password("123")
                            .name("Mai Hương")
                            .gender("female")
                            .role("Co-Pilot")
                            .avatarText("H")
                            .avatarBg("from-rose-400 to-[#FF6B4A]")
                            .build()
            ));
            log.info("Users seeded successfully!");
        }
    }

    private void seedPlaces() {
        if (placeRepository.count() == 0) {
            log.info("Seeding initial places into PostgreSQL...");
            placeRepository.saveAll(List.of(
                    Place.builder()
                            .id("place-1")
                            .title("Phở Thìn Lò Đúc - Bò Tái Lăn")
                            .location("Hai Bà Trưng, Hà Nội")
                            .category("an")
                            .categoryLabel("Ăn ngon")
                            .priceRange("$$")
                            .priceText("75k - 95k")
                            .status("want")
                            .savedDaysAgo(21)
                            .rating(4.8)
                            .reviewNote("Nước dùng béo ngậy nhiều hành hoa, thơm nức mùi tỏi phi giòn tan.")
                            .imageUrl("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80")
                            .lat(21.0185)
                            .lng(105.8567)
                            .votes(9)
                            .sourceLink("https://maps.google.com/?q=Pho+Thin+Lo+Duc")
                            .tags("Món nước, Đặc sản Hà Nội, Ăn sáng")
                            .suggestedWeek(true)
                            .build(),
                    Place.builder()
                            .id("place-2")
                            .title("The Workshop Coffee - Specialty Brew")
                            .location("Quận 1, TP. Hồ Chí Minh")
                            .category("uong")
                            .categoryLabel("Cà phê & Chill")
                            .priceRange("$$")
                            .priceText("65k - 120k")
                            .status("scheduled")
                            .scheduledDate("2026-10-18T09:30:00")
                            .scheduledDayName("Chủ Nhật tuần này")
                            .savedDaysAgo(5)
                            .rating(4.7)
                            .reviewNote("Không gian tầng 2 phong cách công nghiệp cực chill, pour-over hạt Ethiopia đỉnh cao.")
                            .imageUrl("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80")
                            .lat(10.7735)
                            .lng(106.7038)
                            .votes(14)
                            .sourceLink("https://maps.google.com/?q=The+Workshop+Coffee+Saigon")
                            .tags("Specialty Coffee, Làm việc, View phố")
                            .suggestedWeek(true)
                            .build(),
                    Place.builder()
                            .id("place-3")
                            .title("Gió Chiều Quán - BBQ Bên Hồ Tuyền Lâm")
                            .location("Hồ Tuyền Lâm, Đà Lạt")
                            .category("dulich")
                            .categoryLabel("Du lịch & Trốn phố")
                            .priceRange("$$$")
                            .priceText("250k - 450k/người")
                            .status("want")
                            .savedDaysAgo(19)
                            .rating(4.9)
                            .reviewNote("Ngắm hoàng hôn buông xuống mặt hồ lộng gió, nướng gà đồi lá é thơm lừng.")
                            .imageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80")
                            .lat(11.9015)
                            .lng(108.4328)
                            .votes(22)
                            .sourceLink("https://maps.google.com/?q=Ho+Tuyen+Lam+Da+Lat")
                            .tags("Hoàng hôn, Camping, Lẩu nướng")
                            .suggestedWeek(true)
                            .build(),
                    Place.builder()
                            .id("place-4")
                            .title("Bún Chả Hương Liên (Bún Chả Obama)")
                            .location("Hai Bà Trưng, Hà Nội")
                            .category("an")
                            .categoryLabel("Ăn ngon")
                            .priceRange("$$")
                            .priceText("60k - 90k")
                            .status("visited")
                            .visitedDate("2026-10-05")
                            .savedDaysAgo(30)
                            .rating(5.0)
                            .reviewNote("Chả miếng nướng than hoa thơm lừng cháy cạnh, nem cua bể giòn rụm.")
                            .imageUrl("https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&auto=format&fit=crop&q=80")
                            .lat(21.0177)
                            .lng(105.8541)
                            .votes(17)
                            .tags("Đặc sản, Ăn trưa, Truyền thống")
                            .suggestedWeek(false)
                            .build(),
                    Place.builder()
                            .id("place-7")
                            .title("Bắn Cung Đối Kháng Archery Tag")
                            .location("Bình Thạnh, TP. Hồ Chí Minh")
                            .category("choi")
                            .categoryLabel("Chơi vui & Xả stress")
                            .priceRange("$$")
                            .priceText("130k - 180k/giờ")
                            .status("scheduled")
                            .scheduledDate("2026-10-19T16:00:00")
                            .scheduledDayName("Thứ Hai tuần tới")
                            .savedDaysAgo(7)
                            .rating(4.8)
                            .reviewNote("Chơi theo team cực kỳ cuốn, vận động đổ mồ hôi giải tỏa căng thẳng.")
                            .imageUrl("https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80")
                            .lat(10.8010)
                            .lng(106.7115)
                            .votes(16)
                            .tags("Team building, Vận động, Cuối tuần")
                            .suggestedWeek(true)
                            .build(),
                    Place.builder()
                            .id("place-9")
                            .title("Ốc Oanh - Ốc Hương Rang Muối Ớt Cay Nồng")
                            .location("Quận 4, TP. Hồ Chí Minh")
                            .category("an")
                            .categoryLabel("Ăn ngon")
                            .priceRange("$$")
                            .priceText("100k - 200k/người")
                            .status("want")
                            .savedDaysAgo(2)
                            .rating(4.7)
                            .reviewNote("Đường Vĩnh Khánh nhộn nhịp, ốc tươi giòn rụm phủ lớp muối ớt đỏ au cay nồng.")
                            .imageUrl("https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80")
                            .lat(10.7602)
                            .lng(106.7011)
                            .votes(25)
                            .tags("Nhậu nhẹt, Ốc Sài Gòn, Ăn đêm")
                            .suggestedWeek(true)
                            .build(),
                    Place.builder()
                            .id("place-11")
                            .title("Chèo SUP Ngắm Hoàng Hôn Bán Đảo Thanh Đa")
                            .location("Bình Quới, TP. Hồ Chí Minh")
                            .category("choi")
                            .categoryLabel("Chơi vui & Xả stress")
                            .priceRange("$$")
                            .priceText("250k - 350k/suất")
                            .status("scheduled")
                            .scheduledDate("2026-10-24T16:30:00")
                            .scheduledDayName("Thứ Bảy tuần sau")
                            .savedDaysAgo(8)
                            .rating(4.9)
                            .reviewNote("Lướt nhẹ trên dòng sông Sài Gòn khi mặt trời lặn dát vàng mặt nước.")
                            .imageUrl("https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80")
                            .lat(10.8250)
                            .lng(106.7320)
                            .votes(20)
                            .tags("Dưới nước, Hoàng hôn, Chill cuối tuần")
                            .suggestedWeek(true)
                            .build()
            ));
            log.info("Initial places seeded successfully!");
        }
    }

    private void seedWeekPlans() {
        if (weekPlanRepository.count() == 0) {
            log.info("Seeding initial week plans...");
            weekPlanRepository.saveAll(List.of(
                    WeekPlan.builder().dayName("Thứ Hai").placeId("place-7").orderIndex(0).build(),
                    WeekPlan.builder().dayName("Thứ Sáu").placeId("place-9").orderIndex(0).build(),
                    WeekPlan.builder().dayName("Thứ Bảy").placeId("place-11").orderIndex(0).build(),
                    WeekPlan.builder().dayName("Chủ Nhật").placeId("place-2").orderIndex(0).build()
            ));
            log.info("Week plans seeded successfully!");
        }
    }
}
