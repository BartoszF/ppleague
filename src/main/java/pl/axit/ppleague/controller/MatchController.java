package pl.axit.ppleague.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.axit.ppleague.data.EventType;
import pl.axit.ppleague.data.request.CreateMatchCancelationRequest;
import pl.axit.ppleague.data.request.CreateMatchRequest;
import pl.axit.ppleague.data.request.EndMatchRequest;
import pl.axit.ppleague.data.response.*;
import pl.axit.ppleague.exception.MatchExistsException;
import pl.axit.ppleague.model.Match;
import pl.axit.ppleague.model.Player;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.repository.MatchRepository;
import pl.axit.ppleague.repository.PlayerRepository;
import pl.axit.ppleague.repository.UserRepository;
import pl.axit.ppleague.security.CurrentUser;
import pl.axit.ppleague.security.UserPrincipal;
import pl.axit.ppleague.service.MatchService;
import pl.axit.ppleague.service.NotificationService;
import pl.axit.ppleague.service.WsNotificationService;

import javax.persistence.EntityNotFoundException;
import java.util.Map;

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
    @Autowired
    NotificationService notificationService;
    @Autowired
    WsNotificationService wsNotificationService;

    @GetMapping
    public GetMatchesResponse getMatches() {
        return matchService.getMatches();
    }

    @PostMapping
    public String createMatchInvitation(@CurrentUser UserPrincipal currentUser, @RequestBody CreateMatchRequest request) throws MatchExistsException {
        User actor = userRepository.getOne(currentUser.getId());
        User notifier = playerRepository.getOne(request.getPlayerBId()).getUser();
        notificationService.create(EventType.MATCH_INV, null, actor, notifier);

        return "{}";
    }

    @GetMapping("/accept/{id}")
    public CreateMatchResponse acceptMatchInvitation(@CurrentUser UserPrincipal userPrincipal, @PathVariable("id") Long notificationId) throws MatchExistsException {
        Player player = userRepository.findById(userPrincipal.getId()).get().getPlayer();

        CreateMatchResponse response = matchService.createMatchFromInvitation(notificationId, userPrincipal, player);

        return response;
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

    @PostMapping("/cancel")
    public String createMatchCancelation(@CurrentUser UserPrincipal currentUser, @RequestBody CreateMatchCancelationRequest request) {
        User actor = userRepository.getOne(currentUser.getId());
        Match match = matchRepository.getOne(request.getMatchId());
        User notifier = null;
        if (actor.getId().equals(match.getPlayerA().getUser().getId())) {
            notifier = match.getPlayerB().getUser();
        } else {
            notifier = match.getPlayerA().getUser();
        }
        notificationService.create(EventType.MATCH_CANCEL, match.getId(), actor, notifier);

        try {
            ObjectMapper mapper = new ObjectMapper();
            wsNotificationService.notify(mapper.writeValueAsString(Map.of("match_cancel", match.getId())), notifier.getUsername());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return "{}";
    }

    @GetMapping("/{id}/cancel")
    public String cancelMatch(@CurrentUser UserPrincipal currentUser, @PathVariable("id") Long matchId) {
        Match match = matchRepository.getOne(matchId);

        User notify = null;
        if (currentUser.getId().equals(match.getPlayerA().getUser().getId())) {
            notify = match.getPlayerB().getUser();
        } else {
            notify = match.getPlayerA().getUser();
        }

        notificationService.removeRemainingForMatch(matchId);

        matchRepository.delete(match);

        ObjectMapper mapper = new ObjectMapper();

        try {
            wsNotificationService.notify(mapper.writeValueAsString(Map.of("match_cancelled", matchId)), notify.getUsername());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

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
