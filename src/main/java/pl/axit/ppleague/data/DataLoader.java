package pl.axit.ppleague.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import pl.axit.ppleague.data.request.CreateUserRequest;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.repository.MatchRepository;
import pl.axit.ppleague.service.UserService;

@Component
@Profile("dev")
public class DataLoader implements ApplicationRunner {

    private UserService userService;
    private MatchRepository matchRepository;

    @Autowired
    public DataLoader(UserService userService, MatchRepository matchRepository) {
        this.userService = userService;
        this.matchRepository = matchRepository;
    }

    public void run(ApplicationArguments args) {
        User bfelisUser = userService.createUser(new CreateUserRequest("bartosz.felis@siemens-logistics.com", "testhaslo"));
        User odurskiUser = userService.createUser(new CreateUserRequest("olaf.durski@siemens-logistics.com", "testhaslo"));
        User ajarczewskiUser = userService.createUser(new CreateUserRequest("adam.jarczewski@siemens-logistics.com", "testhaslo"));

        for (int i = 0; i < 100; i++) {
            userService.createUser(new CreateUserRequest("test.user" + i + "@siemens-logistics.com", "testhaslo"));
        }
    }
}
