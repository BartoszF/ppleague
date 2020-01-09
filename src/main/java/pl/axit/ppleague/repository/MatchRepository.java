package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.axit.ppleague.model.Match;
import pl.axit.ppleague.model.Player;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findMatchByPlayerAOrPlayerB(Player playerA, Player playerB);

    @Query("select m from Match m where m.playerAScore = 0 and m.playerBScore = 0 and (m.playerA = ?1 or m.playerB = ?1)")
    Optional<Match> findOngoingMatchForPlayer(Player player);
}
