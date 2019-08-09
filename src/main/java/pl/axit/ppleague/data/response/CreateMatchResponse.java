package pl.axit.ppleague.data.response;

import lombok.*;
import pl.axit.ppleague.model.Player;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateMatchResponse {
    private Long id;
    private Player playerA;
    private Player playerB;
}
