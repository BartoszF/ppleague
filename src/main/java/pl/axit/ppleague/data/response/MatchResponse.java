package pl.axit.ppleague.data.response;

import lombok.*;
import pl.axit.ppleague.model.Match;
import pl.axit.ppleague.model.Player;

import java.sql.Timestamp;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MatchResponse {
    private Long id;
    private Player playerA;
    private Player playerB;
    private Integer playerAScore;
    private Integer playerBScore;
    private Timestamp date;

    public static MatchResponse from(Match match) {
        return MatchResponse.builder()
                .id(match.getId())
                .playerA(match.getPlayerA())
                .playerB(match.getPlayerB())
                .playerAScore(match.getPlayerAScore())
                .playerBScore(match.getPlayerBScore())
                .date(match.getDate())
                .build();
    }
}
