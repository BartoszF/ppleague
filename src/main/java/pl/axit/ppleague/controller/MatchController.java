package pl.axit.ppleague.controller;

import org.springframework.web.bind.annotation.*;
import pl.axit.ppleague.data.request.CreateMatchCancelationRequest;
import pl.axit.ppleague.data.request.CreateMatchRequest;
import pl.axit.ppleague.data.request.EndMatchRequest;
import pl.axit.ppleague.data.response.*;
import pl.axit.ppleague.exception.MatchExistsException;
import pl.axit.ppleague.model.Player;
import pl.axit.ppleague.repository.MatchRepository;
import pl.axit.ppleague.repository.PlayerRepository;
import pl.axit.ppleague.repository.UserRepository;
import pl.axit.ppleague.security.CurrentUser;
import pl.axit.ppleague.security.UserPrincipal;
import pl.axit.ppleague.service.MatchService;
import pl.axit.ppleague.service.NotificationService;
import pl.axit.ppleague.service.WsNotificationService;

import javax.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/match")
public class MatchController {
    private final MatchService matchService;

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final NotificationService notificationService;
    private final WsNotificationService wsNotificationService;

    public MatchController(MatchService matchService, MatchRepository matchRepository, UserRepository userRepository, PlayerRepository playerRepository, NotificationService notificationService, WsNotificationService wsNotificationService) {
        this.matchService = matchService;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.playerRepository = playerRepository;
        this.notificationService = notificationService;
        this.wsNotificationService = wsNotificationService;
    }

    @GetMapping
    public GetMatchesResponse getMatches() {
        return matchService.getMatches();
    }

    @PostMapping
    public String createMatchInvitation(@CurrentUser UserPrincipal currentUser, @RequestBody CreateMatchRequest request) throws MatchExistsException {
        matchService.createMatchNotification(currentUser.getId(), request.getPlayerBId());

        return "{}";
    }

    @GetMapping("/accept/{id}")
    public CreateMatchResponse acceptMatchInvitation(@CurrentUser UserPrincipal userPrincipal, @PathVariable("id") Long notificationId) throws MatchExistsException {
        return matchService.createMatchFromInvitation(notificationId, userPrincipal, userPrincipal.getId());
    }

    @PostMapping("/end")
    public EndMatchResponse endMatch(@RequestBody EndMatchRequest request) {
        return matchService.endMatch(request);
    }

    @GetMapping("/ongoing")
    public MatchResponse getMyOngoingMatch(@CurrentUser UserPrincipal currentUser) {
        return matchService.getOngoingMatchForPlayer(currentUser.getId());
    }

    @PostMapping("/cancel")
    public String createMatchCancelation(@CurrentUser UserPrincipal currentUser, @RequestBody CreateMatchCancelationRequest request) {
        matchService.createMatchCancelation(request.getMatchId(), currentUser.getId());

        return "{}";
    }

    @GetMapping("/{id}/cancel")
    public String cancelMatch(@CurrentUser UserPrincipal currentUser, @PathVariable("id") Long matchId) {
        matchService.cancelMatch(matchId, currentUser.getId());

        return "{}";
    }

    @GetMapping("/byPlayer")
    public GetMatchesResponse getMatchesByPlayer(@RequestParam(name = "playerId") Long playerId) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new EntityNotFoundException("Player not found"));

        return matchService.getMatchesByPlayer(player);
    }

    @GetMapping("/pagedByPlayer")
    public GetPagedMatchesResponse getPagedMatchesByPlayer(@RequestParam(name = "playerId") Long playerId, @RequestParam(name = "page") Integer page) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new EntityNotFoundException("Player not found"));

        return matchService.getPagedMatchesByPlayer(player, page);
    }
}
