package movieweb.webapp.service;

import lombok.RequiredArgsConstructor;
import movieweb.webapp.model.dao.BoardMapper;
import movieweb.webapp.model.dto.Board;
import movieweb.webapp.model.dto.Theater;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {
    private final BoardMapper board;

    public List<Board> getAllBoardData() {
        return board.getAllBoardData();
    }


    public void addBoardData(Board newboard) { board.addBoardData(newboard); }


}
