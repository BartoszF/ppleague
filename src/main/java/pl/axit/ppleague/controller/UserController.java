package pl.axit.ppleague.controller;

import org.goochjs.glicko2.RatingCalculator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.axit.ppleague.data.request.CreateUserRequest;
import pl.axit.ppleague.data.response.NotificationsResponse;
import pl.axit.ppleague.data.response.PlayerResponse;
import pl.axit.ppleague.data.response.UserResponse;
import pl.axit.ppleague.exception.UserExistsException;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.repository.PlayerRepository;
import pl.axit.ppleague.repository.UserRepository;
import pl.axit.ppleague.security.CurrentUser;
import pl.axit.ppleague.security.UserPrincipal;
import pl.axit.ppleague.service.NotificationService;
import pl.axit.ppleague.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    private final UserRepository userRepository;

    private final NotificationService notificationService;

    private final PlayerRepository playerRepository;

    public UserController(UserService userService, UserRepository userRepository, NotificationService notificationService, PlayerRepository playerRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.playerRepository = playerRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping
    public void createUser(@RequestBody CreateUserRequest request) throws UserExistsException {
        userService.createUser(request);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        User user = userRepository.getOne(currentUser.getId());
        return new UserResponse(currentUser.getId(), currentUser.getEmail(), currentUser.getName(), PlayerResponse.from(user.getPlayer()));
    }

    @GetMapping("/notifications")
    public NotificationsResponse getNotifications(@CurrentUser UserPrincipal currentUser) {
        User user = userRepository.getOne(currentUser.getId());
        return NotificationsResponse.from(notificationService.getForUser(user));
    }

    @GetMapping("/activate/{key}")
    public void activateUser(@PathVariable("key") String key) {
        userService.activateUser(key);
    }

    @PostMapping("/secretReset")
    public void resetRatings() {

        playerRepository.findAll().forEach(player -> {
            player.setRating(RatingCalculator.DEFAULT_RATING);
            player.setDeviation(RatingCalculator.DEFAULT_DEVIATION);
            player.setVolatility(RatingCalculator.DEFAULT_VOLATILITY);
            playerRepository.save(player);
        });

    }
}
