package pl.axit.ppleague.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.axit.ppleague.data.EventType;
import pl.axit.ppleague.model.Notification;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.repository.NotificationRepository;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getForUser(User user) {
        return notificationRepository.findByNotifier(user);
    }

    public Notification create(EventType eventType, Long eventId, User actor, User notifier) {
        Notification notification =
                Notification.builder()
                        .actor(actor)
                        .eventType(eventType.getId())
                        .eventId(eventId)
                        .notifier(notifier)
                        .build();

        return notificationRepository.save(notification);
    }
}

