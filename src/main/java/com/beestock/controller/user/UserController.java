package com.beestock.controller.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/user")
public class UserController {

    @GetMapping("/user1")
    public String goToDashboard(ModelMap model) {
        model.addAttribute("title", "User1");
        return "user/user1";
    }

    @GetMapping("/my-page")
    public String goToMyPage(ModelMap model) {
        model.addAttribute("title", "MyPage");
        return "user/myPage";
    }

    @GetMapping("/mod/profile")
    public String goToModProfile(ModelMap model) {
        model.addAttribute("title", "MyPage");
        return "mod/profile";
    }

}
