package pl.axit.ppleague.service;

import org.apache.commons.text.WordUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.axit.ppleague.data.request.CreateUserRequest;
import pl.axit.ppleague.exception.ActivationNotFound;
import pl.axit.ppleague.model.Player;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.model.UserActivation;
import pl.axit.ppleague.repository.PlayerRepository;
import pl.axit.ppleague.repository.UserActivationRepository;
import pl.axit.ppleague.repository.UserRepository;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserActivationRepository userActivationRepository;
    private final PasswordEncoder passwordEncoder;
    private final PlayerRepository playerRepository;

    public UserService(UserRepository userRepository, UserActivationRepository userActivationRepository, PasswordEncoder passwordEncoder, PlayerRepository playerRepository) {
        this.userRepository = userRepository;
        this.userActivationRepository = userActivationRepository;
        this.passwordEncoder = passwordEncoder;
        this.playerRepository = playerRepository;
    }


    @Transactional
    public User createUser(CreateUserRequest request) {
//        if (userRepository.existsByEmail(request.getEmailAddress())) {
//            throw new UserExistsException(request.getEmailAddress());
//        }
        User user = new User();

        user.setEmail(request.getEmail());
        //user.setActive(false);
        user.setActive(true);


        var emailPart = request.getEmail().split("@")[0];
        List<String> nameList = Arrays.asList(emailPart.split("\\."));
        String name = WordUtils.capitalizeFully(String.join(" ", nameList));

        user.setUsername(name);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);

        Player player = new Player();
        player.setUser(user);

        playerRepository.save(player);

        user.setPlayer(player);

        return userRepository.save(user);
//
//        String activationKey = UUID.nameUUIDFromBytes(request.getEmailAddress().getBytes()).toString();
//
//        UserActivation activation = new UserActivation();
//        activation.setActivationKey(activationKey);
//        activation.setUser(user);
//        activation.setDate(new Timestamp(new Date().getTime()));
//
//        userActivationRepository.save(activation);
//
//        emailService.sendActivationLink(activation);
    }

    @Transactional
    public void activateUser(String key) throws ActivationNotFound {
        UserActivation activation = userActivationRepository.findByActivationKey(key).orElseThrow(() -> new ActivationNotFound(key));

        User user = activation.getUser();

        user.setActive(true);

        userRepository.save(user);

        userActivationRepository.delete(activation);
    }
}
