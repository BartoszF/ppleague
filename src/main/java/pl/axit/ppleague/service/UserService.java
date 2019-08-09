package pl.axit.ppleague.service;

import org.apache.commons.text.WordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.axit.ppleague.data.request.CreateUserRequest;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.model.UserActivation;
import pl.axit.ppleague.repository.UserActivationRepository;
import pl.axit.ppleague.repository.UserRepository;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserActivationRepository userActivationRepository;

    @Transactional
    public void createUser(CreateUserRequest request) {
        User user = new User();

        user.setEmail(request.getEmailAddress());
        user.setActive(false);

        var emailPart = request.getEmailAddress().split("@")[0];
        List<String> nameList = Arrays.asList(emailPart.split("\\."));
        String name = WordUtils.capitalizeFully(String.join(" ", nameList));

        user.setName(name);
        user.setPassword(request.getPassword());

        user = userRepository.save(user);

        String activationKey = UUID.nameUUIDFromBytes(request.getEmailAddress().getBytes()).toString();

        UserActivation activation = new UserActivation();
        activation.setActivationKey(activationKey);
        activation.setUser(user);
        activation.setDate(new Timestamp(new Date().getTime()));

        userActivationRepository.save(activation);
    }
}
