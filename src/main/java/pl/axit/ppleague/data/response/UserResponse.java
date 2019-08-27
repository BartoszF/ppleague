package pl.axit.ppleague.data.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    Long id;
    String email;
    String name;

}
