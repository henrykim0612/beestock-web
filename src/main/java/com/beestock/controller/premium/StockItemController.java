package com.beestock.controller.premium;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/premium")
public class StockItemController {

    @GetMapping("/stock-item")
    public String goToStockItemManagement(ModelMap model) {
        model.addAttribute("title", "종목코드 현황");
        return "premium/stockItem";
    }

}
