package pl.axit.ppleague.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class WsNotificationService {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final SimpMessagingTemplate simpMessagingTemplate;
    private HashMap<String, String> userCache = new HashMap<>();

    public WsNotificationService(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void notify(String message, String userName) {
        String sessionId = getUserCache().get(userName);
        simpMessagingTemplate.convertAndSendToUser(sessionId, "/topic/notify", message, createHeaders(sessionId));
    }

    private MessageHeaders createHeaders(String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);

        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);

        return headerAccessor.getMessageHeaders();
    }

    public HashMap<String, String> getUserCache() {
        return userCache;
    }

}
