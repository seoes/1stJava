package movieweb.webapp.model.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class User {
    public User() {}

    @NonNull private String userID;
    @NonNull private String userName;
    @NonNull private String userTel;
    @NonNull private String userEmail;
    @NonNull private String password;

    private String image;
    private String description;
    private String profile;
}
