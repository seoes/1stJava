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

    //스프링부트에서 DAO는 인터페이스로 작성하고 @Mapper를 통해 mapper.xml의 id를 찾아간다.
    //아이디 중복검사는 DB를 체크해서 아이디가 존재하면 숫자가 카운트되며 중복되는 아이디가 없을 때 0을 반환한다.
    //회원가입은 User를 받아서 추가되는 경우 숫자가 카운트된다.
    //로그인은 User를 받아서 User를 반환해주는데, 이는 프론트엔드단에서 세션을 위해 객체형태로 반환해주는 것이다.
    int getId(User dto);
    int addMember(User dto);
    User login(User dto);

}
