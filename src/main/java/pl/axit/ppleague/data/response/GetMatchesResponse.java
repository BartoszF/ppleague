package pl.axit.ppleague.data.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetMatchesResponse {
    private List<MatchResponse> matches;
}
