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

    @GetMapping("/my-page")
    public String goToMyPage(ModelMap model) {
        model.addAttribute("title", "마이페이지");
        return "user/myPage";
    }

    @GetMapping("/mod-account")
    public String goToModProfile(ModelMap model) {
        model.addAttribute("title", "마이페이지 수정");
        return "user/modAccount";
    }

}
