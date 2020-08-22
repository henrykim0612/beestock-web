package com.beestock.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;

@Controller
@Slf4j
@SessionAttributes("loginSession")
public class MainController {

    @RequestMapping(value={"/", "/index"}, method = RequestMethod.GET)
    public String goToIndex(ModelMap model) {
        model.addAttribute("title", "Main");
        return "home/dashboard";
    }

    @RequestMapping(value="/login/login-home", method = RequestMethod.GET)
    public String goToLogin(ModelMap model) {
        model.addAttribute("title", "Login");
        return "login/loginHome";
    }

    @RequestMapping(value="/login/signup", method = RequestMethod.GET)
    public String goToSignup(ModelMap model) {
        model.addAttribute("title", "Sign up");
        return "login/signUp";
    }


//    @RequestMapping(value="/login/login-proc", method = RequestMethod.POST)
//    public String loginProc(@RequestParam UserVo param, ModelMap model) {
//        return "login/loginHome";
//    }
//
//    @RequestMapping(value="/login/logout", method = RequestMethod.GET)
//    public String logout(ModelMap model, SessionStatus sessionStatus) {
//        sessionStatus.setComplete(); // 세션제거
//        model.addAttribute("title", "Login");
//        return "login/loginHome";
//    }

}
