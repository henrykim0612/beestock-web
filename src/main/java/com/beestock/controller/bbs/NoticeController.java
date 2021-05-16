package com.beestock.controller.bbs;

import com.beestock.attribute.CommonAttribute;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/bbs")
public class NoticeController extends CommonAttribute {
    // 공지사항 메인
    @GetMapping("/notice.do")
    public String goToNotice(ModelMap model) {
        model.addAttribute("title", "공지사항");
        return "bbs/notice/notice";
    }
    // 공지사항 상세보기
    @GetMapping("/notice/{noticeId}.do")
    public String goToQaDetails(ModelMap model, @PathVariable String noticeId) {
        model.addAttribute("title", "공지사항 상세보기");
        model.addAttribute("noticeId", noticeId);
        return "bbs/notice/noticeDetails";
    }

    // 공지사항 수정
    @GetMapping("/notice/modify/{noticeId}.do")
    public String goToModify(ModelMap model, @PathVariable String noticeId) {
        model.addAttribute("title", "공지사항 수정");
        model.addAttribute("noticeId", noticeId);
        return "bbs/notice/noticeModify";
    }

    // 공지사항 등록창
    @GetMapping("/notice-form.do")
    public String goToNoticeForm(ModelMap model) {
        model.addAttribute("title", "공지사항 등록");
        return "bbs/notice/noticeForm";
    }
}
