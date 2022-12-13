package movieweb.webapp.model.dao;

import movieweb.webapp.model.dto.Theater;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface TheaterMapper {
    List<Theater> getAllTheaterData();
    void updateCoords(Theater theater);

    Theater getTheaterByCode(String code);
}
