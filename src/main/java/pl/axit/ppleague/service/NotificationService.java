package pl.axit.ppleague.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.axit.ppleague.data.EventType;
import pl.axit.ppleague.data.response.NotificationResponse;
import pl.axit.ppleague.model.Notification;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.repository.NotificationRepository;
import pl.axit.ppleague.repository.PlayerRepository;
import pl.axit.ppleague.repository.UserRepository;

import javax.persistence.EntityExistsException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    WsNotificationService wsNotificationService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PlayerRepository playerRepository;

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

        String notifierUsername = notifier.getUsername();

        Notification notification =
                Notification.builder()
                        .actor(actor)
                        .eventType(eventType.getId())
                        .eventId(eventId)
                        .notifier(notifier)
                        .date(new Timestamp(new Date().getTime()))
                        .build();

        NotificationResponse response = NotificationResponse.from(notification);

        notification = notificationRepository.save(notification);

        response.setId(notification.getId());

        ObjectMapper mapper = new ObjectMapper();

        try {
            wsNotificationService.notify(mapper.writeValueAsString(Map.of("notification", response)), notifierUsername);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return notification;
    }

    public void rejectNotification(Long notificationId, Long userId) throws Exception {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();

        if (notification.getActor().getId().equals(userId) || notification.getNotifier().getId().equals(userId)) {
            notificationRepository.delete(notification);
            return;
        }

        throw new Exception("Notification don't belongs to user");
    }

    public List<Notification> getInvitationForPlayer(Long userId) {
        User user = userRepository.getOne(userId);

        return notificationRepository.findByNotifierOrActorAndEventType(user, user, EventType.MATCH_INV.getId());
    }

    public void delete(Notification notification) {
        notificationRepository.delete(notification);
    }
}

