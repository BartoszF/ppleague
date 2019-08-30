package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.axit.ppleague.model.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {

}
