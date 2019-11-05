package pl.axit.ppleague.data.response;

import lombok.*;
import pl.axit.ppleague.model.Notification;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationsResponse {
    private List<NotificationResponse> notifications;

    public static NotificationsResponse from(List<Notification> notifications) {
        List<NotificationResponse> notificationResponses = new ArrayList<>();

        for (Notification n : notifications)
            notificationResponses.add(NotificationResponse.from(n));

        return NotificationsResponse.builder().notifications(notificationResponses).build();
    }
}
