package movieweb.webapp.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class Theater {
    private String province;
    private String city;
    private int code;
    private String name;
    private int screenCount;
    private int seatCount;
    private int filmCount;
    private int count2d;
    private int count3d;
    private int count4d;
    private int countImax;
    private String company;
    private Date openDate;
    private String address;
    private String phone;
    private String url;
    private Double latitude;
    private Double longitude;
}
