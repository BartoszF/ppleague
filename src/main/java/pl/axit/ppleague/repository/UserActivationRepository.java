package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.axit.ppleague.model.UserActivation;

public interface UserActivationRepository extends JpaRepository<UserActivation, Long> {
}
