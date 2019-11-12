package pl.axit.ppleague.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class WsNotificationService {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    private HashMap<String, String> userCache = new HashMap<>();

    public void notify(String message, String userName) {
        String sessionId = getUserCache().get(userName);
        simpMessagingTemplate.convertAndSendToUser(userName, "/queue/notify", message, createHeaders(sessionId));
        logger.info("Sending ws to " + userName + " session " + sessionId);
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
