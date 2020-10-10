package com.beestock.controller.admin;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/user-management")
    public String goToUserManagement(ModelMap model) {
        model.addAttribute("title", "사용자관리");
        return "admin/user/userManagement";
    }

    @GetMapping("/code-management")
    public String goToCodeManagement(ModelMap model) {
        model.addAttribute("title", "시스템 코드관리");
        return "admin/code/codeManagement";
    }

    @GetMapping("/profile-management")
    public String goToCodeProfileManagement(ModelMap model) {
        model.addAttribute("title", "프로파일 관리");
        return "admin/profile/profileManagement";
    }

    @GetMapping("/profile-form")
    public String goToProfileForm(ModelMap model) {
        model.addAttribute("title", "프로파일 등록");
        return "admin/profile/profileForm";
    }

    @GetMapping("/profile-details/{profileId}")
    public String goToProfileDetails(ModelMap model, @PathVariable String profileId) {
        model.addAttribute("title", "프로파일 상세");
        model.addAttribute("profileId", profileId);
        return "admin/profile/profileDetails";
    }


}
