package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.axit.ppleague.model.Match;

public interface MatchRepository extends JpaRepository<Match, Long> {
}
