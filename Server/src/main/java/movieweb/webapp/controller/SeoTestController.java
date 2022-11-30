package movieweb.webapp.controller;

import lombok.RequiredArgsConstructor;

import movieweb.webapp.model.dto.User;
import movieweb.webapp.service.TestService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RequiredArgsConstructor
@Controller
public class SeoTestController {
    @Value("${java.file.test}")
    String envValue;
    @GetMapping("detail")
    public String detail(@RequestParam(value = "name", required = false) String name, Model model) {
        model.addAttribute("data", name); //data: "yo" 값
        model.addAttribute("data1", "헬로월드");
        return "detailed"; //hello.html 렌더링하기
    }

    @GetMapping("main")
    public String main() {
        return "main";
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

    @GetMapping("helloworld")
    @ResponseBody
    public String Helloworld() {
        return envValue;
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


    private final TestService testService;
    @GetMapping("test")
    @ResponseBody
    public List<User> test() {
        return testService.getAllDataList();
    }

/*
    */
/* 게시판 controller 구성 *//*

    @GetMapping("list")
    public String list() { return "list"; }

    @GetMapping("post")
    public String post() { return "post"; }
*/

}
