package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.axit.ppleague.model.UserActivation;

import java.util.Optional;

public interface UserActivationRepository extends JpaRepository<UserActivation, Long> {
    Optional<UserActivation> findByActivationKey(String activationKey);
}
