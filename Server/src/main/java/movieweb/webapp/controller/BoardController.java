package movieweb.webapp.controller;

import movieweb.webapp.model.dto.Board;
import movieweb.webapp.model.dto.BoardDto;
import movieweb.webapp.model.dto.Theater;
import movieweb.webapp.service.BoardService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BoardController {
    private BoardService boardService;


    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/postlist")
    public List<Board> list() {
        return boardService.getAllBoardData();
    }

    @PostMapping("/postwriting")
    @ResponseBody
    public void write(@RequestBody Board board) {
        boardService.addBoardData(board);

    }
//    @PostMapping("/post")
//    public String write(BoardDto boardDto) {
//        boardService.savePost(boardDto);
//        return "redirect:/list";
//    }
//
//    @GetMapping("/post/{id}")
//    public String detail(@PathVariable("id") Long id, Model model) {
//        BoardDto boardDto = boardService.getPost(id);
//        model.addAttribute("post", boardDto);
//        return "detail";
//    }
//
//    @GetMapping("/post/edit/{id}")
//    public String edit(@PathVariable("id") Long id, Model model) {
//        BoardDto boardDto = boardService.getPost(id);
//        model.addAttribute("post", boardDto);
//        return "edit";
//    }
//
//    @PutMapping("/post/edit/{id}")
//    public String update(BoardDto boardDto) {
//        boardService.savePost(boardDto);
//        return "redirect:/list";
//
//    }
//
//    @DeleteMapping("/post/{id}")
//    public String delete(@PathVariable("id") Long id) {
//        boardService.deletePost(id);
//        return "redirect:/list";
//    }
}