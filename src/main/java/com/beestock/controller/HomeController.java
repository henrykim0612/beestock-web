package com.beestock.controller;

import com.beestock.attribute.CommonAttribute;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/home")
public class HomeController extends CommonAttribute {

    @GetMapping("/dashboard.do")
    public String goToDashboard(ModelMap model) {
        model.addAttribute("title", "대시보드");
        return "home/dashboard";
    }

    @GetMapping("/documentation.do")
    public String goToDocumentation(ModelMap model) {
        model.addAttribute("title", "BEESTOCK 가이드");
        return "home/documentation";
    }

    @GetMapping("/about.do")
    public String goToAbout(ModelMap model) {
        model.addAttribute("title", "소개");
        return "home/about";
    }

    @GetMapping("/pricing-table.do")
    public String goToPricingTable(ModelMap model) {
        model.addAttribute("title", "구독");
        return "home/pricingTable";
    }

    @GetMapping("/guide.do")
    public String goToGuide(ModelMap model) {
        model.addAttribute("title", "가이드");
        return "home/guide";
    }


    @GetMapping("/itemcode.do")
    public String goToItemCode(ModelMap model) {
        model.addAttribute("title", "종목코드 검색");
        return "premium/plus/itemCode";
    }


}
