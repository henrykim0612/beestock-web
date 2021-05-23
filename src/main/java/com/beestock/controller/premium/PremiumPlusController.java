package com.beestock.controller.premium;

import com.beestock.attribute.CommonAttribute;
import com.beestock.vo.profile.QuarterInfoVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping("/premium/plus")
public class PremiumPlusController extends CommonAttribute {

//    @GetMapping("/itemcode.do")
//    public String goToItemCode(ModelMap model) {
//        model.addAttribute("title", "종목코드 검색");
//        return "premium/plus/itemCode";
//    }

    @GetMapping("/itemcode/detailpop.do")
    public String goToItemCodeDetailPopup(QuarterInfoVo param, ModelMap model) {
        model.addAttribute("title", "");
        model.addAttribute("selectedQuarterDate", param.getSelectedQuarterDate());
        model.addAttribute("profileType", param.getProfileType());
        model.addAttribute("profileId", param.getProfileId());
        model.addAttribute("itemCode", param.getItemCode());
        model.addAttribute("itemName", param.getItemName());
        model.addAttribute("schType", param.getSchType());
        return "premium/plus/itemCodeDetailPopup";
    }


}
