package pl.axit.ppleague.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.axit.ppleague.data.response.PlayerMatchesResponse;
import pl.axit.ppleague.data.response.PlayerResponse;
import pl.axit.ppleague.model.Player;
import pl.axit.ppleague.repository.PlayerRepository;
import pl.axit.ppleague.service.MatchService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    MatchService matchService;

    @GetMapping
    public ResponseEntity<List<PlayerResponse>> getPlayers() {

        List<Player> players = playerRepository.findAll();
        List<PlayerResponse> responses = new ArrayList<>();

        players.forEach(player -> responses.add(PlayerResponse.builder().playerId(player.getId()).rating(player.getRating()).name(player.getUser().getUsername()).build()));

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<PlayerMatchesResponse> getMatches(@PathVariable("id") Long playerId) {
        return ResponseEntity.ok(matchService.getMatches(playerId));
    }
}
