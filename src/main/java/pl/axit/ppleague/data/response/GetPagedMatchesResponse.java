package pl.axit.ppleague.data.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetPagedMatchesResponse {
    private List<MatchResponse> matches;
    private boolean hasMore;
}
