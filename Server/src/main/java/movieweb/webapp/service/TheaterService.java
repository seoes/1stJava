package movieweb.webapp.service;


import movieweb.webapp.model.dto.Theater;

import java.util.List;

public interface TheaterService {
    public List<Theater> getAllTheaterData();
    public Theater getTheaterByCode(String code);
    public Theater setCoords(Theater newTheater);
}
