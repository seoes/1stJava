package movieweb.webapp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import movieweb.webapp.model.dto.Movie;
import movieweb.webapp.service.MovieService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.client.reactive.HttpComponentsClientHttpConnector;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

@RestController
public class MovieController {


    @GetMapping("searchTitle")
    public String searchMovieByTitle(@RequestParam("title") String title, @RequestParam("releaseDts") String releaseDts) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String url = "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp";

        UriComponents builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("ServiceKey", "0Q768YE1107L574JOUZ8")
                .queryParam("title", title)
                .queryParam("releaseDts", releaseDts)
                .queryParam("sort", "RANK,1")
                .queryParam("listCount", 100)
                .queryParam("collection=kmdb_new2")
                .build();
        HttpEntity entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(builder.toString(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @GetMapping("searchCode")
    public String searchMovieByCode(@RequestParam("movieId") String movieId, @RequestParam("movieSeq") String movieSeq) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String url = "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp";

        UriComponents builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("ServiceKey", "0Q768YE1107L574JOUZ8")
                .queryParam("movieId", movieId)
                .queryParam("movieSeq", movieSeq)
                .queryParam("sort", "RANK,1")
                .queryParam("listCount", 50)
                .queryParam("collection=kmdb_new2")
                .build();
        HttpEntity entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(builder.toString(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }



}
