package com.beestock.controller.analysis;

import com.beestock.service.profile.ProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
//@SessionAttributes("loginSession")
@RequestMapping("/analysis")
public class AnalysisController {

    private final ProfileService profileService;
    public AnalysisController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile/{profileId}")
    public String goToPricingTable(ModelMap model, @PathVariable String profileId, Authentication auth) {
        model.addAttribute("title", "포트폴리오 분석");
        model.addAttribute("profileId", profileId);
        return "analysis/profileAnalysis";
    }

}
