package movieweb.webapp.model.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class User {
    public User() {}

    @NonNull private int userID;
    @NonNull private String userName;
    @NonNull private String userTel;
    @NonNull private String password;

    private String description;
    private String profile;
}
