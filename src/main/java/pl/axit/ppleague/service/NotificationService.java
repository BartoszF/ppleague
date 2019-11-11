package pl.axit.ppleague.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.axit.ppleague.data.EventType;
import pl.axit.ppleague.model.Notification;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.repository.NotificationRepository;

import javax.persistence.EntityExistsException;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Optional<Notification> find(Long notificationId) {
        return notificationRepository.findById(notificationId);
    }

    public List<Notification> getForUser(User user) {
        return notificationRepository.findByNotifier(user);
    }

    public Notification create(EventType eventType, Long eventId, User actor, User notifier) {

        if (notificationRepository.findByNotifierAndActorAndEventType(notifier, actor, eventType.getId()).isPresent() || notificationRepository.findByNotifierAndActorAndEventType(actor, notifier, eventType.getId()).isPresent()) {
            throw new EntityExistsException("Invitation already exists");
        }

        Notification notification =
                Notification.builder()
                        .actor(actor)
                        .eventType(eventType.getId())
                        .eventId(eventId)
                        .notifier(notifier)
                        .build();

        return notificationRepository.save(notification);
    }

    public void rejectNotification(Long notificationId, Long userId) throws Exception {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();

        if (notification.getActor().getId().equals(userId) || notification.getNotifier().getId().equals(userId)) {
            notificationRepository.delete(notification);
            return;
        }

        throw new Exception("Notification don't belongs to user");
    }

    public void delete(Notification notification) {
        notificationRepository.delete(notification);
    }
}

