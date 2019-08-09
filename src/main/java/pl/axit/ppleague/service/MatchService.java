package pl.axit.ppleague.service;

import org.goochjs.glicko2.Rating;
import org.goochjs.glicko2.RatingCalculator;
import org.goochjs.glicko2.RatingPeriodResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.axit.ppleague.data.request.CreateMatchRequest;
import pl.axit.ppleague.data.request.EndMatchRequest;
import pl.axit.ppleague.data.response.CreateMatchResponse;
import pl.axit.ppleague.data.response.EndMatchResponse;
import pl.axit.ppleague.data.response.GetMatchesResponse;
import pl.axit.ppleague.data.response.MatchResponse;
import pl.axit.ppleague.model.Match;
import pl.axit.ppleague.model.Player;
import pl.axit.ppleague.repository.MatchRepository;
import pl.axit.ppleague.repository.PlayerRepository;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private RatingCalculator ratingCalculator;

    @Autowired
    private RatingPeriodResults results;

    public GetMatchesResponse getMatches() {
        List<MatchResponse> matches = new ArrayList<>();

        matchRepository.findAll().forEach(match -> matches.add(MatchResponse.from(match)));

        return new GetMatchesResponse(matches);
    }

    public MatchResponse getMatch(Long id) {
        return MatchResponse.from(matchRepository.getOne(id));
    }

    @Transactional
    public CreateMatchResponse createMatch(CreateMatchRequest request) {
        Match match = new Match();

        Player playerA = playerRepository.getOne(request.getPlayerAId());
        Player playerB = playerRepository.getOne(request.getPlayerBId());

        match.setPlayerA(playerA);
        match.setPlayerB(playerB);

        match = matchRepository.save(match);

        return CreateMatchResponse.builder().id(match.getId()).playerA(playerA).playerB(playerB).build();
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
