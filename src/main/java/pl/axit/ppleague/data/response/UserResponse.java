package pl.axit.ppleague.data.response;

import lombok.*;
import pl.axit.ppleague.model.User;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    Long id;
    String email;
    String name;
    PlayerResponse player;

    public static UserResponse from(User user) {
        return UserResponse.builder().id(user.getId()).email(user.getEmail()).email(user.getEmail()).player(PlayerResponse.from(user.getPlayer())).build();
    }
}
