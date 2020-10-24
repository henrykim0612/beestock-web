package com.beestock.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
//@SessionAttributes("loginSession")
@RequestMapping("/home")
public class HomeController {

    @GetMapping("/dashboard")
    public String goToDashboard(ModelMap model) {
        model.addAttribute("title", "대시보드");
        return "home/dashboard";
    }

    @GetMapping("/documentation")
    public String goToDocumentation(ModelMap model) {
        model.addAttribute("title", "BeeStock 가이드");
        return "home/documentation";
    }

    @GetMapping("/pricing-table")
    public String goToPricingTable(ModelMap model) {
        model.addAttribute("title", "구독");
        return "home/pricingTable";
    }

}
