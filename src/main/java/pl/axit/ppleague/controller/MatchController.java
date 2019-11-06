package pl.axit.ppleague.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.axit.ppleague.data.request.CreateMatchRequest;
import pl.axit.ppleague.data.request.EndMatchRequest;
import pl.axit.ppleague.data.response.CreateMatchResponse;
import pl.axit.ppleague.data.response.EndMatchResponse;
import pl.axit.ppleague.data.response.GetMatchesResponse;
import pl.axit.ppleague.data.response.MatchResponse;
import pl.axit.ppleague.exception.MatchExistsException;
import pl.axit.ppleague.model.Player;
import pl.axit.ppleague.repository.MatchRepository;
import pl.axit.ppleague.repository.PlayerRepository;
import pl.axit.ppleague.repository.UserRepository;
import pl.axit.ppleague.security.CurrentUser;
import pl.axit.ppleague.security.UserPrincipal;
import pl.axit.ppleague.service.MatchService;

import javax.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/match")
public class MatchController {
    @Autowired
    private MatchService matchService;

    @Autowired
    MatchRepository matchRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private PlayerRepository playerRepository;

    @GetMapping
    public GetMatchesResponse getMatches() {
        return matchService.getMatches();
    }

    @PostMapping
    public CreateMatchResponse createMatch(@CurrentUser UserPrincipal currentUser, @RequestBody CreateMatchRequest request) throws MatchExistsException {
        return matchService.createMatch(request, currentUser);
    }

    @PostMapping("/end")
    public EndMatchResponse endMatch(@RequestBody EndMatchRequest request) {
        return matchService.endMatch(request);
    }

    @GetMapping("/ongoing")
    public MatchResponse getMyOngoingMatch(@CurrentUser UserPrincipal currentUser) {
        Player player = userRepository.findById(currentUser.getId()).get().getPlayer();
        return matchService.getOngoingMatchForPlayer(player);
    }

    @GetMapping("/byPlayer")
    public GetMatchesResponse getMatchesByPlayer(@RequestParam(name = "playerId") Long playerId) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new EntityNotFoundException("Player not found"));

        return matchService.getMatchesByPlayer(player);
    }
}
