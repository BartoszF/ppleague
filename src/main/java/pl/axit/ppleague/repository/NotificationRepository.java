package pl.axit.ppleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.axit.ppleague.model.Notification;
import pl.axit.ppleague.model.User;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByActor(User actor);

    List<Notification> findByNotifier(User notifier);

    List<Notification> findByNotifierId(Long notifierId);

}
