package pl.axit.ppleague.player.model;

import lombok.*;
import pl.axit.ppleague.user.model.User;

import javax.persistence.*;

@Entity
@Table(name = "player")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Player {

    @Id
    @Column(name = "id")
    private Long id;

    private Double rating;
    private Double deviation;
    private Double volatility;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
