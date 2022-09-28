package seospringtest.seotest.controller;

import javax.sound.sampled.DataLine;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import seospringtest.dailySales.*;

@Controller

public class SeoTestController {
    @GetMapping("detail")
    public String detail(@RequestParam(value = "name", required = false) String name, Model model) {
        model.addAttribute("data", name); //data: "yo" 값
        model.addAttribute("data1", "헬로월드");
        return "detailed"; //hello.html 렌더링하기
    }

    @GetMapping("hello-string")
    @ResponseBody 
    public String helloString(@RequestParam("name") String name) {
        return "hello " + name;
    }

    @GetMapping("hello-api")
    @ResponseBody
    public Hello helloapi(@RequestParam("name") String name) {
        Hello hello = new Hello();
        hello.setName(name);
        return hello;
    }

    static class Hello {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    // @PostMapping("detail")
    // public String detail(Model model) {

    // }
}
