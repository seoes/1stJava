package movieweb.webapp.service;

import lombok.RequiredArgsConstructor;
import movieweb.webapp.model.dao.UserMapper;
import movieweb.webapp.model.dto.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestServiceImpl implements TestService{
    private final UserMapper testMapper;

    // 게시판 : 유저+포스트 -> 10개씩 글 리턴
    // 글 페이지 : 유저+포스트+댓글 -> 페이지 전체 리턴 + 글 10개씩 리턴
    // 마이페이지 : 유저 -> 유저정보 리턴
    // 영화관: 백
    // 지도 : 프론트 + 백에서 보내준 정보
    // 박스오피스 : 프론트


    @Override
    public List<User> getAllDataList() {
        return testMapper.getAllUserData();
    }


    @Override
    public List<User> findUserByName(String name) {
        return testMapper.findUserByName(name);
    }
}
