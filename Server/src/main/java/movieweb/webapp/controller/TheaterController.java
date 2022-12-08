package movieweb.webapp.controller;

import lombok.RequiredArgsConstructor;
import movieweb.webapp.model.dao.TheaterMapper;
import movieweb.webapp.model.dto.Theater;
import movieweb.webapp.service.TheaterService;
import movieweb.webapp.service.TheaterServiceImple;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class TheaterController {
    private final TheaterServiceImple theaterService;
    private final TheaterMapper theater;
    @GetMapping("theater")
    @ResponseBody
    public List<Theater> yeah() {return theater.getAllTheaterData();}

    @PutMapping("setcoords")
    @ResponseBody
    public void setCoords(@RequestBody Theater theater) {
        theaterService.setCoords(theater);
    }
}
