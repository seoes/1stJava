package movieweb.webapp.model.dao;

import movieweb.webapp.model.dto.Board;
import movieweb.webapp.model.dto.Theater;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface BoardMapper {
    List<Board> getAllBoardData(); //모든 포스트 가져오기
    List<Board> getLast10Board(int index); //최근 10개만 가져오기
    List<Board> findBoardByUserId(int userId); //작성자 Username으로 찾기(검색)
    List<Board> findBoardByTitle(String title); //제목으로 찾기(검색)
    void addBoardData(Board board); //게시글 등록
}
