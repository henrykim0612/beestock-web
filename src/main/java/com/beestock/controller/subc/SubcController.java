package com.beestock.controller.subc;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/subc")
public class SubcController {

    @GetMapping("/subc1")
    public String goToDashboard(ModelMap model) {
        model.addAttribute("title", "Subc1");
        return "subc/subc1";
    }

}
