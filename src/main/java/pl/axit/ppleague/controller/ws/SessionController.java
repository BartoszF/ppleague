package pl.axit.ppleague.controller.ws;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import pl.axit.ppleague.data.request.RegisterMessageRequest;
import pl.axit.ppleague.service.WsNotificationService;

@Controller
public class SessionController {

    private final WsNotificationService notificationService;

    public SessionController(WsNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @MessageMapping("/register")
    public void registerClient(@Payload RegisterMessageRequest message, SimpMessageHeaderAccessor headerAccessor) {
        notificationService.getUserCache().put(message.getUsername(), headerAccessor.getSessionId());
    }
}
