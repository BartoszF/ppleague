package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.axit.ppleague.model.Notification;
import pl.axit.ppleague.model.User;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByActor(User actor);

    List<Notification> findByNotifier(User notifier);

    List<Notification> findByNotifierId(Long notifierId);

    List<Notification> findByNotifierOrActorAndEventType(User actor, User notifier, Integer eventType);

    Optional<Notification> findByNotifierAndActorAndEventType(User notifier, User actor, Integer eventType);

}
