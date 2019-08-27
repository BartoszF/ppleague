package pl.axit.ppleague.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.axit.ppleague.model.Player;
import pl.axit.ppleague.repository.PlayerRepository;

import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {
    @Autowired
    PlayerRepository playerRepository;

    @GetMapping
    public List<Player> getPlayers() {
        return playerRepository.findAll();
    }
}
