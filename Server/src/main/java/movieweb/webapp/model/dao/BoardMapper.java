package movieweb.webapp.model.dao;

import movieweb.webapp.model.dto.Post;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface PostMapper {
    List<Post> getAllPostData(); //모든 포스트 가져오기
    List<Post> getLast10Post(int index); //최근 10개만 가져오기
    List<Post> findPostByUserId(int userId); //작성자 Username으로 찾기(검색)
    List<Post> findPostByTitle(String title); //제목으로 찾기(검색)
}
