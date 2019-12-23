package pl.axit.ppleague.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.goochjs.glicko2.Rating;
import org.goochjs.glicko2.RatingCalculator;
import org.goochjs.glicko2.RatingPeriodResults;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import pl.axit.ppleague.data.EventType;
import pl.axit.ppleague.data.request.CreateMatchRequest;
import pl.axit.ppleague.data.request.EndMatchRequest;
import pl.axit.ppleague.data.response.*;
import pl.axit.ppleague.exception.MatchExistsException;
import pl.axit.ppleague.model.Match;
import pl.axit.ppleague.model.Notification;
import pl.axit.ppleague.model.Player;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.repository.MatchRepository;
import pl.axit.ppleague.repository.PagedMatchRepository;
import pl.axit.ppleague.repository.PlayerRepository;
import pl.axit.ppleague.repository.UserRepository;
import pl.axit.ppleague.security.UserPrincipal;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.*;

@Service
public class MatchService {

    private final MatchRepository matchRepository;

    private final PagedMatchRepository pagedMatchRepository;

    private final PlayerRepository playerRepository;

    private final UserRepository userRepository;

    private final RatingCalculator ratingCalculator;

    private final NotificationService notificationService;

    private final RatingPeriodResults results;

    private final WsNotificationService wsNotificationService;

    public MatchService(MatchRepository matchRepository, PagedMatchRepository pagedMatchRepository, PlayerRepository playerRepository, UserRepository userRepository, RatingCalculator ratingCalculator, NotificationService notificationService, RatingPeriodResults results, WsNotificationService wsNotificationService) {
        this.matchRepository = matchRepository;
        this.pagedMatchRepository = pagedMatchRepository;
        this.playerRepository = playerRepository;
        this.userRepository = userRepository;
        this.ratingCalculator = ratingCalculator;
        this.notificationService = notificationService;
        this.results = results;
        this.wsNotificationService = wsNotificationService;
    }

    public GetMatchesResponse getMatches() {
        List<MatchResponse> matches = new ArrayList<>();

        matchRepository.findAll().forEach(match -> matches.add(MatchResponse.from(match)));

        return new GetMatchesResponse(matches);
    }

    public MatchResponse getOngoingMatchForPlayer(Long playerId) {
        Player player = userRepository.findById(playerId).get().getPlayer();
        Optional<Match> match = matchRepository.findOngoingMatchForPlayer(player);

        if (match.isPresent())
            return MatchResponse.from(match.get());

        return null;
    }

    public GetMatchesResponse getMatchesByPlayer(Player player) {
        List<MatchResponse> matchResponses = new ArrayList<>();

        List<Match> matches = matchRepository.findMatchByPlayerAOrPlayerB(player, player);

        matches.forEach(match -> matchResponses.add(MatchResponse.from(match)));

        return new GetMatchesResponse(matchResponses);
    }

    public GetPagedMatchesResponse getPagedMatchesByPlayer(Player player, Integer page) {
        List<MatchResponse> matchResponses = new ArrayList<>();

        Page<Match> matches = pagedMatchRepository.getAllByPlayerAOrPlayerB(player, player, PageRequest.of(page, 10000)); //such huge number is temporary

        matches.forEach(match -> matchResponses.add(MatchResponse.from(match)));

        return new GetPagedMatchesResponse(matchResponses, matches.hasNext());
    }

    public MatchResponse getMatch(Long id) {
        return MatchResponse.from(matchRepository.getOne(id));
    }

    @Transactional
    public CreateMatchResponse createMatchFromInvitation(Long invitationId, UserPrincipal userPrincipal, Long playerId) throws MatchExistsException {
        CreateMatchRequest request = new CreateMatchRequest();

        Player player = userRepository.findById(playerId).get().getPlayer();

        Notification invitation = notificationService.find(invitationId).orElseThrow();

        request.setPlayerAId(invitation.getActor().getId());
        request.setPlayerBId(invitation.getNotifier().getId());

        CreateMatchResponse response = createMatch(request, userPrincipal);

        notificationService.delete(invitation);

        try {
            ObjectMapper mapper = new ObjectMapper();
            wsNotificationService.notify(mapper.writeValueAsString(Map.of("ongoing_match", "true")), invitation.getActor().getUsername());
            wsNotificationService.notify(mapper.writeValueAsString(Map.of("ongoing_match", "true")), invitation.getNotifier().getUsername());

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return response;
    }

    @Transactional
    public CreateMatchResponse createMatch(CreateMatchRequest request, UserPrincipal userPrincipal) throws MatchExistsException {
        Long userId = userPrincipal.getId();

        if (matchRepository.findOngoingMatchForPlayer(userRepository.findById(userId).get().getPlayer()).isPresent()) {
            throw new MatchExistsException();
        }

        Match match = new Match();

        Player playerA = playerRepository.findById(request.getPlayerAId()).get();
        Player playerB = playerRepository.findById(request.getPlayerBId()).get();

        match.setPlayerA(playerA);
        match.setPlayerB(playerB);

        match.setPlayerAScore(0);
        match.setPlayerBScore(0);

        match.setDate(new Timestamp(new Date().getTime()));

        match = matchRepository.save(match);
        //test

        return CreateMatchResponse.builder().id(match.getId()).playerA(PlayerResponse.from(playerA)).playerB(PlayerResponse.from(playerB)).build();
    }

    @Transactional
    public EndMatchResponse endMatch(EndMatchRequest request) {
        Match match = matchRepository.getOne(request.getMatchId());

        match.setPlayerAScore(request.getPlayerAScore());
        match.setPlayerBScore(request.getPlayerBScore());

        Player playerA = match.getPlayerA();
        Player playerB = match.getPlayerB();

        //UPDATE RATINGS
        Rating playerARating = playerA.getRatingObject(ratingCalculator);
        Rating playerBRating = playerB.getRatingObject(ratingCalculator);

        if (request.getPlayerAScore() > request.getPlayerBScore()) {
            results.addResult(playerARating, playerBRating);
        } else {
            results.addResult(playerBRating, playerARating);
        }

        ratingCalculator.updateRatings(results);

        playerA.saveFromRatingObject(playerARating);
        playerB.saveFromRatingObject(playerBRating);

        playerRepository.saveAll(List.of(playerA, playerB));

        match = matchRepository.save(match);

        EndMatchResponse response = EndMatchResponse.builder().id(match.getId()).build();

        try {
            ObjectMapper mapper = new ObjectMapper();
            wsNotificationService.notify(mapper.writeValueAsString(Map.of("end_match", "true")), playerA.getUser().getUsername());
            wsNotificationService.notify(mapper.writeValueAsString(Map.of("end_match", "true")), playerB.getUser().getUsername());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        notificationService.removeRemainingForMatch(match.getId());

        return response;
    }

    public PlayerMatchesResponse getMatches(Long playerId) {
        Player player = playerRepository.getOne(playerId);

        List<Match> matches = matchRepository.findMatchByPlayerAOrPlayerB(player, player);

        PlayerMatchesResponse matchesResponses = new PlayerMatchesResponse();

        matches.stream().forEach((match) -> {
            if (match.getPlayerAScore().equals(0) && match.getPlayerBScore().equals(0)) return;

            matchesResponses.setMatches(matchesResponses.getMatches() + 1);
            if (match.getPlayerAScore() > match.getPlayerBScore()) {
                if (match.getPlayerA().equals(player)) {
                    matchesResponses.setWon(matchesResponses.getWon() + 1);
                } else {
                    matchesResponses.setLost(matchesResponses.getLost() + 1);
                }
            } else if (match.getPlayerAScore() < match.getPlayerBScore()) {
                if (match.getPlayerA().equals(player)) {
                    matchesResponses.setLost(matchesResponses.getLost() + 1);
                } else {
                    matchesResponses.setWon(matchesResponses.getWon() + 1);
                }
            }
        });

        return matchesResponses;
    }

    public void createMatchNotification(Long id, Long playerBId) {
        User actor = (User) Hibernate.unproxy(userRepository.getOne(id));
        User notifier = playerRepository.getOne(playerBId).getUser();
        System.out.println("CREATING NOTIFICATION FOR " + actor.getId() + " " + notifier.getId());
        notificationService.create(EventType.MATCH_INV, null, actor, notifier);
    }

    public void createMatchCancelation(Long matchId, Long actorId) {
        User actor = userRepository.getOne(actorId);
        Match match = matchRepository.getOne(matchId);
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
    }

    public void cancelMatch(Long matchId, Long currentUser) {
        Match match = matchRepository.getOne(matchId);

        User notify = null;
        if (currentUser.equals(match.getPlayerA().getUser().getId())) {
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
    }
}
