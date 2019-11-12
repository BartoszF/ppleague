package pl.axit.ppleague.data.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlayerMatchesResponse {
    Integer matches = 0;
    Integer won = 0;
    Integer lost = 0;
}
