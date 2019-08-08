package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.axit.ppleague.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
