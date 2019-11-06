package pl.axit.ppleague.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping(value = {"/web", "/"})
    public String redirectToWeb() {
        return "redirect:/web/index.html";
    }
}
