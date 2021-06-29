package com.beestock.controller.analysis;

import com.beestock.attribute.CommonAttribute;
import com.beestock.common.CommonUtils;
import com.beestock.service.profile.ProfileLogService;
import com.beestock.service.profile.ProfileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
//@SessionAttributes("loginSession")
@RequestMapping("/analysis")
public class AnalysisController extends CommonAttribute {

    private final ProfileService profileService;
    private final ProfileLogService profileLogService;
    private final CommonUtils cmmUtils;

    @Value("#{eventProps.limitQuarter}")
    private int limitQuarter;

    public AnalysisController(ProfileService profileService, ProfileLogService profileLogService, CommonUtils cmmUtils) {
        this.profileService = profileService;
        this.profileLogService = profileLogService;
        this.cmmUtils = cmmUtils;
    }

    @GetMapping("/profile/details.do")
    public String goToAnalysis(ModelMap model,
                                   @RequestParam int profileType,
                                   @RequestParam String profileId,
                                   @RequestParam(required = false) String quarterDate,
                                   Authentication auth) {
        // 국내 프로필은 프리미엄 플러스만 가능함
        if (auth != null && profileType == 1 && (cmmUtils.isBasicUser(auth) || cmmUtils.isStandardUser(auth) || cmmUtils.isPremiumUser(auth))) {
            return "home/pricingTable";
        } else {
            if (auth != null) {
                profileLogService.insertProfileLog(auth, profileType, profileId); // 포트폴리오 접근 로그 생성
            }
            model.addAttribute("title", "포트폴리오 분석");
            model.addAttribute("paramQuarterDate", quarterDate);
            model.addAttribute("limitQuarter", (auth == null || cmmUtils.isBasicUser(auth)) ? limitQuarter : -1);
            model.addAttribute(profileService.selectOne(profileId));
            return "analysis/profileAnalysis";
        }
    }

}
