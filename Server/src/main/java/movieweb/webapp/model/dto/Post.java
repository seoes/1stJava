package movieweb.webapp.model.dto;

import lombok.Data;
import lombok.NonNull;

import java.util.Date;

@Data
public class Post {
    @NonNull int postID;
    int userID;
    @NonNull String title;
    Date date; //DateTime형식으로 바꿔서 시간도 나타내줘야 할 듯
    @NonNull String content;
    String poster; //포스터 파일 링크를 String으로 저장
}
