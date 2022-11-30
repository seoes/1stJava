package movieweb.webapp.service;

import lombok.RequiredArgsConstructor;
import movieweb.webapp.model.dao.TheaterMapper;
import movieweb.webapp.model.dto.Theater;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TheaterServiceImple {
    private final TheaterMapper theater;

    public List<Theater> getAllTheaterData() {return theater.getAllTheaterData();}

    public void setCoords(Theater newTheater) {
        theater.updateCoords(newTheater);
    }
}
