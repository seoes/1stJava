package movieweb.webapp.model.dto;

import lombok.Data;
import lombok.NonNull;

import java.time.LocalDateTime;

@Data
public class Board {

    private Long id;

    private String author;


    private Integer likes;
    private String title;
    private String content;


    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
}
