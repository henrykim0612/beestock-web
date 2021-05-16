package com.beestock.controller.user;

import com.beestock.attribute.CommonAttribute;
import com.beestock.common.CommonUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;

@Controller
@Slf4j
@RequestMapping("/user")
public class UserController extends CommonAttribute {

    private final CommonUtils cmmUtils;

    public UserController(CommonUtils cmmUtils) {
        this.cmmUtils = cmmUtils;
    }

    @GetMapping("/my-page.do")
    public String goToMyPage(ModelMap model, Principal principal) {
        cmmUtils.updateAuthentication(principal.getName());
        model.addAttribute("title", "마이페이지");
        return "user/myPage";
    }

    @GetMapping("/mod-account.do")
    public String goToModProfile(ModelMap model) {
        model.addAttribute("title", "마이페이지 수정");
        return "user/modAccount";
    }

}
