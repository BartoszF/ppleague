package pl.axit.ppleague.data;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import pl.axit.ppleague.data.request.CreateUserRequest;
import pl.axit.ppleague.model.Player;
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
        User bfelisUser = userService.createUser(new CreateUserRequest("bartosz.felis@siemens-logistics.com", "ax4testen"));
        Player bfelisPlayer = (Player) Hibernate.unproxy(bfelisUser.getPlayer());
        User odurskiUser = userService.createUser(new CreateUserRequest("olaf.durski@siemens-logistics.com", "ax4testen"));
        Player odurskiPlayer = (Player) Hibernate.unproxy(odurskiUser.getPlayer());
        User ajarczewskiUser = userService.createUser(new CreateUserRequest("adam.jarczewski@siemens-logistics.com", "ax4testen"));
        Player ajarczewskiPlayer = (Player) Hibernate.unproxy(ajarczewskiUser.getPlayer());
    }
}
