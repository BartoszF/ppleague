package pl.axit.ppleague.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import pl.axit.ppleague.model.Match;
import pl.axit.ppleague.model.Player;

public interface PagedMatchRepository extends PagingAndSortingRepository<Match, Long> {

    Page<Match> getAllByPlayerAOrPlayerB(Player playerA, Player playerB, Pageable pageable);
}
