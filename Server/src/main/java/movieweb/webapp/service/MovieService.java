package movieweb.webapp.service;

import movieweb.webapp.model.dto.Movie;

import java.util.List;

public interface MovieService {
    public List<Movie> searchMovieByTitle(String title);
}
