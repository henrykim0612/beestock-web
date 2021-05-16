package com.beestock.controller;

import com.beestock.attribute.CommonAttribute;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@Slf4j
//@SessionAttributes("loginSession")
public class LoginController extends CommonAttribute {

    @RequestMapping(value={"/index.do"}, method = RequestMethod.GET)
    public String goToIndex(ModelMap model) {
        model.addAttribute("title", "Main");
        return "home/dashboard";
    }

    @RequestMapping(value="/login/login-home.do", method = {RequestMethod.GET, RequestMethod.POST})
    public String goToLogin(ModelMap model) {
        model.addAttribute("title", "Login");
        return "login/loginHome";
    }

    @RequestMapping(value="/login/signup.do", method = RequestMethod.GET)
    public String goToSignup(ModelMap model) {
        model.addAttribute("title", "Sign up");
        return "login/signUp";
    }

    @RequestMapping(value="/login/finding-account.do", method = RequestMethod.GET)
    public String goToFindingAccount(ModelMap model) {
        model.addAttribute("title", "Sign up");
        return "login/findingAccount";
    }

}
