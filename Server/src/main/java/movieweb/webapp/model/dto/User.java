package movieweb.webapp.model.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class User {
    public User() {}

    @NonNull private String userID;
    @NonNull private String userName;
    @NonNull private int userTel;
    @NonNull private String password;

    private String description;
    private String profile;
}
