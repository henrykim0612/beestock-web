package com.beestock.controller.bbs;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/bbs")
public class BbsController {

    // 공지사항 메인
    @GetMapping("/notice")
    public String goToNotice(ModelMap model) {
        model.addAttribute("title", "공지사항");
        return "bbs/notice";
    }

    // Q&A 메인
    @GetMapping("/qa")
    public String goToQa(ModelMap model) {
        model.addAttribute("title", "Q&A");
        return "bbs/qa";
    }
    // Q&A 등록창
    @GetMapping("/qa-form")
    public String goToQaForm(ModelMap model) {
        model.addAttribute("title", "Q&A 등록");
        return "bbs/qaForm";
    }
    // Q&A 상세보기
    @GetMapping("/qa/{qaId}")
    public String goToQaDetails(ModelMap model, @PathVariable String qaId) {
        model.addAttribute("title", "Q&A 상세보기");
        model.addAttribute("qaId", qaId);
        return "bbs/qaDetails";
    }

}
