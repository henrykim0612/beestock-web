package com.beestock.controller.bbs;

import com.beestock.attribute.CommonAttribute;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/bbs")
public class QaController extends CommonAttribute {

    // Q&A 메인
    @GetMapping("/qa.do")
    public String goToQa(ModelMap model) {
        model.addAttribute("title", "Q&A");
        return "bbs/qa/qa";
    }
    // Q&A 등록창
    @GetMapping("/qa-form.do")
    public String goToQaForm(ModelMap model) {
        model.addAttribute("title", "Q&A 등록");
        return "bbs/qa/qaForm";
    }
    // Q&A 상세보기
    @GetMapping("/qa/{qaId}.do")
    public String goToQaDetails(ModelMap model, @PathVariable String qaId) {
        model.addAttribute("title", "Q&A 상세보기");
        model.addAttribute("qaId", qaId);
        return "bbs/qa/qaDetails";
        // Q&A 수정페이지
    }

    @GetMapping("/qa/modify/{qaId}.do")
    public String goToQaModify(ModelMap model, @PathVariable String qaId) {
        model.addAttribute("title", "Q&A 수정");
        model.addAttribute("qaId", qaId);
        return "bbs/qa/qaModify";
    }


}
