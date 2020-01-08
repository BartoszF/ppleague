package pl.axit.ppleague.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.axit.ppleague.data.response.NotificationsResponse;
import pl.axit.ppleague.security.CurrentUser;
import pl.axit.ppleague.security.UserPrincipal;
import pl.axit.ppleague.service.NotificationService;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{notificationId}/reject")
    public String rejectNotification(@CurrentUser UserPrincipal userPrincipal, @PathVariable("notificationId") Long notificationId) throws Exception {
        notificationService.rejectNotification(notificationId, userPrincipal.getId());

        return "{}";
    }

    @GetMapping("/matchInvitation")
    public NotificationsResponse getInvitationForPlayerMatch(@CurrentUser UserPrincipal userPrincipal) {
        return NotificationsResponse.from(notificationService.getInvitationForUser(userPrincipal.getId()));
    }

}
