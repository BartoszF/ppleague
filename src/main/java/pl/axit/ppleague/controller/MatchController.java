package pl.axit.ppleague.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.axit.ppleague.data.request.CreateMatchRequest;
import pl.axit.ppleague.data.response.CreateMatchResponse;
import pl.axit.ppleague.data.response.GetMatchesResponse;
import pl.axit.ppleague.service.MatchService;

@RestController
@RequestMapping("/match")
public class MatchController {
    @Autowired
    private MatchService matchService;

    @GetMapping
    public GetMatchesResponse getMatches() {
        return matchService.getMatches();
    }

    @PostMapping
    public CreateMatchResponse createMatch(@RequestBody CreateMatchRequest request) {
        return matchService.createMatch(request);
    }
}
