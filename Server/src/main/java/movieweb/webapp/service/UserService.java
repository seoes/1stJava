package movieweb.webapp.service;

import movieweb.webapp.model.dto.User;

public interface UserService {
    public boolean getId(User dto);
    public boolean addMember(User dto);
    public User login(User dto);

}
