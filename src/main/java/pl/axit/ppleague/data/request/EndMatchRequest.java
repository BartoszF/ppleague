package pl.axit.ppleague.data.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EndMatchRequest {
    private Long matchId;
    private Integer playerAScore;
    private Integer playerBScore;
}
