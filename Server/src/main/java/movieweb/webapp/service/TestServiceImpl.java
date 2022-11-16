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



    @Override
    public List<User> getAllDataList() {
        return testMapper.getAllUserData();
    }

    @Override
    public List<User> findUserByName(String name) {
        return testMapper.findUserByName(name);
    }


}
