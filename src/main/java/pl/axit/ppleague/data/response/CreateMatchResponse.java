package pl.axit.ppleague.data.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateMatchResponse {
    private Long id;
    private PlayerResponse playerA;
    private PlayerResponse playerB;
}
