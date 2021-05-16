package com.beestock.attribute;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.ModelAttribute;

@PropertySource(value = "classpath:properties/app.properties", encoding = "UTF-8")
public class CommonAttribute {

    @Value("${app.mode}")
    private String appMode;

    @ModelAttribute("jsDir")
    public String getMode() {
        return "PRODUCTION".equals(appMode) ? "js/production" : "js/dev";
    }
}
