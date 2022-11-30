package movieweb.webapp.service;

import lombok.RequiredArgsConstructor;
import movieweb.webapp.model.dao.UserMapper;
import movieweb.webapp.model.dto.User;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServicempl implements UserService {
    private final UserMapper dao;

    public boolean getId(User dto) {
        int n = dao.getId(dto);
        return n > 0;
    }

    public boolean addMember(User dto) {
        int n = dao.addMember(dto);
        return n > 0;
    }

    public User login(User dto) {
        return dao.login(dto);
    }
}
