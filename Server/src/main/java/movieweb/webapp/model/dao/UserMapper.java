package movieweb.webapp.model.dao;

import movieweb.webapp.model.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface UserMapper {
    List<User> getAllUserData();
    List<User> findUserByName(String name); //ID로 유저 찾기


}
