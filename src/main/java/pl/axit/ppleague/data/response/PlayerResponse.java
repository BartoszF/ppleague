package pl.axit.ppleague.data.response;

import lombok.*;
import pl.axit.ppleague.model.Player;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlayerResponse {
    private Long playerId;
    private Double rating;
    private String name;

    public static PlayerResponse from(Player player) {
        return PlayerResponse.builder().playerId(player.getId()).rating(player.getRating()).name(player.getUser().getUsername()).build();
    }
}
