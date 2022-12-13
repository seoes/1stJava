package movieweb.webapp.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class Movie {

    private String Result;
    private String RowValue;
    private String docId;
    private String movieId;
    private String movieSeq;
    private String title;
    private String titleEng;
    private String titleOrg;
    private String titleEtc;
    private String directorNm;
    private String directorEnNm;
    private String directorId;
}
