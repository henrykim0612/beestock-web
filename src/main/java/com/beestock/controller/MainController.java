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

    @RequestMapping(value="/login/login-home", method = {RequestMethod.GET, RequestMethod.POST})
    public String goToLogin(ModelMap model) {
        model.addAttribute("title", "Login");
        return "login/loginHome";
    }

    @RequestMapping(value="/login/signup", method = RequestMethod.GET)
    public String goToSignup(ModelMap model) {
        model.addAttribute("title", "Sign up");
        return "login/signUp";
    }

    @RequestMapping(value="/login/finding-account", method = RequestMethod.GET)
    public String goToFindingAccount(ModelMap model) {
        model.addAttribute("title", "Sign up");
        return "login/findingAccount";
    }

}
