package movieweb.webapp.model.dto;

import lombok.*;
import movieweb.webapp.domain.entity.Board;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class BoardDto {
    private Long id;
    private String author;

    private Integer likes;
    private String title;
    private String content;


    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    public Board toEntity() {
        Board build = Board.builder()
                .id(id)
                .author(author)
                .title(title)
                .content(content)
                .likes(likes)
                .build();
        return build;
    }

    @Builder
    public BoardDto(Long id, String author, String title, String content, Integer likes, LocalDateTime createdDate, LocalDateTime modifiedDate) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.content = content;
        this.likes = likes;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
    }
}