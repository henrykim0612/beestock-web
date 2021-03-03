package com.beestock.controller.premium;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/premium/plus")
public class PremiumPlusController {

    @GetMapping("/itemcode.do")
    public String goToItemCode(ModelMap model) {
        model.addAttribute("title", "종목코드 검색");
        return "premium/plus/itemCode";
    }

}
