package pl.axit.ppleague.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import pl.axit.ppleague.data.request.CreateUserRequest;
import pl.axit.ppleague.service.UserService;

@Component
@Profile("dev")
public class DataLoader implements ApplicationRunner {

    private UserService userService;

    @Autowired
    public DataLoader(UserService userService) {
        this.userService = userService;
    }

    public void run(ApplicationArguments args) {
        userService.createUser(new CreateUserRequest("bartosz.felis@siemens-logistics.com", "ax4testen"));
        userService.createUser(new CreateUserRequest("olaf.durski@siemens-logistics.com", "ax4testen"));
        userService.createUser(new CreateUserRequest("adam.jarczewski@siemens-logistics.com", "ax4testen"));
    }
}
