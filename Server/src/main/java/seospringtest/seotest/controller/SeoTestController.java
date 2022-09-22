package seospringtest.seotest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class SeoTestController {
    @GetMapping("detail")
    public String detail(Model model) {
        model.addAttribute("data", "whats up"); //data: "yo" 값
        model.addAttribute("data1", "헬로월드");
        return "detailed"; //hello.html 렌더링하기
    }
    // @PostMapping("detail")
    // public String detail(Model model) {

    // }
}
