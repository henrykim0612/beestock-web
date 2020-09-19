package com.beestock.controller.admin;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/admin1")
    public String goToDashboard(ModelMap model) {
        model.addAttribute("title", "Admin1");
        return "admin/admin1";
    }

    @GetMapping("/user-management")
    public String goToUserManagement(ModelMap model) {
        model.addAttribute("title", "사용자관리");
        return "admin/userManagement";
    }

    @GetMapping("/code-management")
    public String goToCodeManagement(ModelMap model) {
        model.addAttribute("title", "코드관리");
        return "admin/codeManagement";
    }

}
