package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.axit.ppleague.model.Notification;
import pl.axit.ppleague.model.User;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByActor(User actor);

    List<Notification> findByNotifier(User notifier);

    List<Notification> findByNotifierId(Long notifierId);

    @Query("select n from Notification n where n.eventType = ?1 and (n.actor = ?2 or n.notifier = ?3)")
    List<Notification> findByEventTypeAndNotifierOrActor(Integer eventType, User actor, User notifier);

    Optional<Notification> findByNotifierAndActorAndEventType(User notifier, User actor, Integer eventType);

    List<Notification> findByEventIdAndEventType(Long eventId, Integer eventType);

}
