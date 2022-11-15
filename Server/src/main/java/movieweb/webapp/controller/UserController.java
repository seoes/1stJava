package movieweb.webapp.controller;

import lombok.RequiredArgsConstructor;
import movieweb.webapp.model.dto.User;
import movieweb.webapp.service.TestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class UserController {
    private final TestService testService;


    @GetMapping("getUser")
    @ResponseBody
    public List<User> findUserById(@RequestParam("name") String name) {
        return testService.findUserByName(name);
    }
}
