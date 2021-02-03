package com.beestock.controller.analysis;

import com.beestock.common.CommonUtils;
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
    private final CommonUtils cmmUtils;

    public AnalysisController(ProfileService profileService, CommonUtils cmmUtils) {
        this.profileService = profileService;
        this.cmmUtils = cmmUtils;
    }

    @GetMapping("/profile/{profileType}/{profileId}.do")
    public String goToPricingTable(ModelMap model, @PathVariable int profileType, @PathVariable String profileId, Authentication auth) {
        // 국내 프로필은 프리미엄 플러스만 가능함
        if (profileType == 1 && (cmmUtils.isUser(auth) || cmmUtils.isStandardUser(auth) || cmmUtils.isPremiumUser(auth))) {
            return "home/pricingTable";
        } else {
            model.addAttribute("title", "포트폴리오 분석");
            model.addAttribute(profileService.selectOne(profileId));
            return "analysis/profileAnalysis";
        }
    }

}
