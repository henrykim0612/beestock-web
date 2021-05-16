package com.beestock.controller;

import com.beestock.attribute.CommonAttribute;
import com.beestock.vo.common.ExceptionVo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/errors")
public class ErrorController extends CommonAttribute {

    @RequestMapping(method = {RequestMethod.GET, RequestMethod.POST}, value = "/403.do")
    public String accessDenied(ExceptionVo exceptionVo, ModelMap model, Authentication auth, HttpServletRequest req) {
//        AccessDeniedException ade = (AccessDeniedException) req.getAttribute(WebAttributes.ACCESS_DENIED_403);
        model.addAttribute("err", exceptionVo);
        return "errors/error403";
    }

    @PostMapping("/404.do")
    public String notFound(ExceptionVo exceptionVo, ModelMap model, Authentication auth, HttpServletRequest req) {
        model.addAttribute("err", exceptionVo);
        return "errors/error404";
    }

    @PostMapping("/500.do")
    public String internalServerError(ExceptionVo exceptionVo, ModelMap model, Authentication auth, HttpServletRequest req) {
        model.addAttribute("err", exceptionVo);
        return "errors/error500";
    }

    @PostMapping("/io.do")
    public String io(ExceptionVo exceptionVo, ModelMap model, Authentication auth, HttpServletRequest req) {
        model.addAttribute("err", exceptionVo);
        return "errors/exception";
    }

    @PostMapping("/sql.do")
    public String sql(ExceptionVo exceptionVo, ModelMap model, Authentication auth, HttpServletRequest req) {
        model.addAttribute("err", exceptionVo);
        return "errors/exception";
    }

    @PostMapping("/excel.do")
    public String excelException(ExceptionVo exceptionVo, ModelMap model, Authentication auth, HttpServletRequest req) {
        model.addAttribute("err", exceptionVo);
        return "errors/excelException";
    }


    @PostMapping("/exception.do")
    public String exception(ExceptionVo exceptionVo, ModelMap model, Authentication auth, HttpServletRequest req) {
        model.addAttribute("err", exceptionVo);
        return "errors/exception";
    }

}
