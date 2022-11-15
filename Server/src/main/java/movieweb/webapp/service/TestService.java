package movieweb.webapp.service;

import movieweb.webapp.model.dto.User;

import java.util.List;

public interface TestService {
    public List<User> getAllDataList();
    public List<User> findUserByName(String name);
}
