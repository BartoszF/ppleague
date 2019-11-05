package pl.axit.ppleague.service;

import org.goochjs.glicko2.Rating;
import org.goochjs.glicko2.RatingCalculator;
import org.goochjs.glicko2.RatingPeriodResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.axit.ppleague.data.request.CreateMatchRequest;
import pl.axit.ppleague.data.request.EndMatchRequest;
import pl.axit.ppleague.data.response.*;
import pl.axit.ppleague.exception.MatchExistsException;
import pl.axit.ppleague.model.Match;
import pl.axit.ppleague.model.Player;
import pl.axit.ppleague.repository.MatchRepository;
import pl.axit.ppleague.repository.PlayerRepository;
import pl.axit.ppleague.repository.UserRepository;
import pl.axit.ppleague.security.UserPrincipal;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RatingCalculator ratingCalculator;

    @Autowired
    private RatingPeriodResults results;

    public GetMatchesResponse getMatches() {
        List<MatchResponse> matches = new ArrayList<>();

        matchRepository.findAll().forEach(match -> matches.add(MatchResponse.from(match)));

        return new GetMatchesResponse(matches);
    }

    public MatchResponse getOngoingMatchForPlayer(Player player) {
        return MatchResponse.from(matchRepository.findOngoingMatchForPlayer(player).get());
    }

    public GetMatchesResponse getMatchesByPlayer(Player player) {
        List<MatchResponse> matchResponses = new ArrayList<>();

        List<Match> matches = matchRepository.findMatchByPlayerAOrPlayerB(player, player);

        matches.forEach(match -> matchResponses.add(MatchResponse.from(match)));

        return new GetMatchesResponse(matchResponses);
    }

    public MatchResponse getMatch(Long id) {
        return MatchResponse.from(matchRepository.getOne(id));
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

        return EndMatchResponse.builder().id(match.getId()).build();
    }
}
