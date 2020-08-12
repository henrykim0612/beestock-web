package com.beestock.controller;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.WebAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/errors")
public class ErrorController {

    @GetMapping("/403")
    public String accessDenied(ModelMap model, Authentication auth, HttpServletRequest req) {
        AccessDeniedException ade = (AccessDeniedException) req.getAttribute(WebAttributes.ACCESS_DENIED_403);
        model.addAttribute("title", "Access denied");
        model.addAttribute("auth", auth);
        model.addAttribute("errMsg", ade);
        return "errors/error403";
    }

}
