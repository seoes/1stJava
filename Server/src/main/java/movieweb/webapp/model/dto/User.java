package movieweb.webapp.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NonNull;

@Data
@Getter
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

    public User(String userID, String userName,String userTel,String userEmail, String password)
    {
        this.userID = userID;
        this.userName = userName;
        this.userTel = userTel;
        this.userEmail = userEmail;
        this.password = password;
    }
    public void setId(String userID) {
        this.userID = userID;
    }

    public void setName(String userName) {
        this.userName = userName;
    }

    public void setTel(String userTel) {
        this.userTel = userTel;
    }

    public void setEmail(String userEmail)
    {
        this.userEmail = userEmail;
    }

    public void setPwd(String password) {
        this.password = password;
    }

    @Override
     // 중복 사용 방지
    public String toString() {
        return "userID='" + userID + '\'' +
                ", userName='" + userName+ '\'' +
                ", userTel='" + userTel + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", password='" + password;
    }
}

