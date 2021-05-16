package com.beestock.controller.admin;

import com.beestock.attribute.CommonAttribute;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/admin")
public class AdminController extends CommonAttribute {

    @GetMapping("/user-management.do")
    public String goToUserManagement(ModelMap model) {
        model.addAttribute("title", "사용자관리");
        return "admin/user/userManagement";
    }

    @GetMapping("/code-management.do")
    public String goToCodeManagement(ModelMap model) {
        model.addAttribute("title", "시스템 코드관리");
        return "admin/code/codeManagement";
    }

    @GetMapping("/profile-management.do")
    public String goToCodeProfileManagement(ModelMap model) {
        model.addAttribute("title", "포트폴리오 관리");
        return "admin/profile/profileManagement";
    }

    @GetMapping("/profile-form.do")
    public String goToProfileForm(ModelMap model) {
        model.addAttribute("title", "포트폴리오 등록");
        return "admin/profile/profileForm";
    }

    @GetMapping("/profile-details/{profileId}.do")
    public String goToProfileDetails(ModelMap model, @PathVariable String profileId) {
        model.addAttribute("title", "포트폴리오 상세");
        model.addAttribute("profileId", profileId);
        return "admin/profile/profileDetails";
    }

    @GetMapping("/quarter-management.do")
    public String goToQuarterManagement(ModelMap model) {
        model.addAttribute("title", "분기별 포트폴리오 관리");
        return "admin/quarter/quarterManagement";
    }

    @GetMapping("/profile-order-management.do")
    public String goToProfileOrderManagement(ModelMap model) {
        model.addAttribute("title", "분기별 포트폴리오 관리");
        return "admin/profile/profileOrderManagement";
    }

    @GetMapping("/latest-price-management.do")
    public String goToLatestPriceManagement(ModelMap model) {
        model.addAttribute("title", "Daily 주가 수동 업로드");
        return "admin/latestprice/latestPriceManagement";
    }

    @GetMapping("/avg-price-management.do")
    public String goToAvgManagement(ModelMap model) {
        model.addAttribute("title", "평균주가 수동 업로드");
        return "admin/avg/avgPriceManagement";
    }

    @GetMapping("/userlog.do")
    public String goToUserLog(ModelMap model) {
        model.addAttribute("title", "사용자 로그분석");
        return "admin/log/userLog";
    }

    @GetMapping("/feedback.do")
    public String goToFeedback(ModelMap model) {
        model.addAttribute("title", "피드백 확인");
        return "admin/feedback/feedback";
    }


}
