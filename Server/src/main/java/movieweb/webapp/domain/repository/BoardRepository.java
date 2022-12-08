package movieweb.webapp.domain.repository;

import movieweb.webapp.domain.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {

}
