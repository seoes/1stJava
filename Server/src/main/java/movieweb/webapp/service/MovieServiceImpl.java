package movieweb.webapp.service;

import org.json.JSONArray;
import org.json.JSONObject;

public class MovieService {
//    인증키 - 0Q768YE1107L574JOUZ8
    String jsonString;
    JSONObject jsonObject = new JSONObject(jsonString);
    JSONArray jsonArray = jsonObject.getJSONArray("posts");

    String getMovieInfo() {

    }
}
