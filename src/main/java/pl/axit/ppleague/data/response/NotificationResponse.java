package pl.axit.ppleague.data.response;

import lombok.*;
import pl.axit.ppleague.data.EventType;
import pl.axit.ppleague.model.Notification;
import pl.axit.ppleague.model.User;

import java.sql.Timestamp;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {
    private Long id;
    private User actor;
    private EventType eventType;
    private Long eventId;
    private Timestamp date;
    private boolean seen;

    public static NotificationResponse from(Notification notification) {
        return
                NotificationResponse.builder()
                        .id(notification.getId())
                        .actor(notification.getActor())
                        .date(notification.getDate())
                        .eventType(notification.getEventType().orElseThrow())
                        .eventId(notification.getEventId())
                        .seen(notification.isSeen())
                        .build();
    }
}