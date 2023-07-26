package com.solace.quoteengine.admin.apis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

import org.springframework.boot.autoconfigure.SpringBootApplication;


@Controller
public class AdminPanel {
    @Autowired
    private Environment env;

    @RequestMapping("/adminPanel")
    public String controlPanel(HttpSession session, Model model) {
        String backendUrl = env.getProperty("app.backendUrl");
        model.addAttribute("Today", (new java.util.Date()));
        model.addAttribute("backendUrl", backendUrl);

        return "adminPanel";
    }
}
