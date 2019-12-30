package pl.axit.ppleague.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailServiceImpl {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendMail(String to, String subject, String body) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(to);
            msg.setFrom("rd-pong@axit.pl");

            msg.setSubject("[ppleague] " + subject);
            msg.setText(body);

            javaMailSender.send(msg);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }
}
