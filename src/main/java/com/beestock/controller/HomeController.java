package com.beestock.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

@Controller
@SessionAttributes("loginSession")
@RequestMapping("/home")
public class HomeController {

    @GetMapping("/dashboard")
    public String goToDashboard(ModelMap model) {
        model.addAttribute("title", "Dashboard");
        return "home/dashboard";
    }

    @GetMapping("/documentation")
    public String goToDocumentation(ModelMap model) {
        model.addAttribute("title", "Documentation");
        return "home/documentation";
    }

}
