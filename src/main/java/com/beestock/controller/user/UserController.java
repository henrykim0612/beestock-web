package com.beestock.controller.user;

import com.beestock.attribute.CommonAttribute;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/user")
public class UserController extends CommonAttribute {

    @GetMapping("/my-page.do")
    public String goToMyPage(ModelMap model) {
        model.addAttribute("title", "마이페이지");
        return "user/myPage";
    }

    @GetMapping("/mod-account.do")
    public String goToModProfile(ModelMap model) {
        model.addAttribute("title", "마이페이지 수정");
        return "user/modAccount";
    }

}
