package movieweb.webapp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import movieweb.webapp.model.dto.User;
import movieweb.webapp.service.TestService;
import movieweb.webapp.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
//각각은 중요한 정보가 오고가므로 PostMapping 처리 해준다.
//getId는 서비스에서의 getId로부터 받아온 값에 대해 true인 경우 아이디가 중복되므로 "no"를 리턴해주도록 했다.
//addMember도 마찬가지로 회원가입이 완료되어 카운트 된 숫자가 0보다 클 경우 true를 반환한다. true일 때 회원가입이 완료되므로 "ok"를 리턴한다.
//login은 로그인한 정보를 세션에 객체로 저장해두기 위해 User를 반환하여 프론트엔드단까지 가져간다.

@Slf4j
@RequiredArgsConstructor
@RestController
public class UserController {
    private final TestService testService;
    private final UserService userService;
    public final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("getUser")
    @ResponseBody
    public List<User> findUserById(@RequestParam("name") String name) {
        return testService.findUserByName(name);
    }
    @PostMapping("/getId")
    public String getId(User dto) {
        logger.info("MemberController getId()");
        boolean b = userService.getId(dto);
        if(b) {
            return "no";
        }
        return "ok";
    }
    @PostMapping("/addMember")
    public String addMember(User dto) {
        logger.info("MemberController addMember()");
        boolean b = userService.addMember(dto);

        logger.info(dto.toString());

        if(b) {
            return "ok";
        }
        return "no";
    }

    @PostMapping("/login")
    public User login(User dto) {
        logger.info("MemberController login()");
        return userService.login(dto);
    }
}
