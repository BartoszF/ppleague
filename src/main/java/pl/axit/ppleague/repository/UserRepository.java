package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.axit.ppleague.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
}
