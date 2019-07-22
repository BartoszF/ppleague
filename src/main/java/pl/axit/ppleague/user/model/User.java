package pl.axit.ppleague.user.model;

import lombok.*;
import pl.axit.ppleague.player.model.Player;

import javax.persistence.*;

@Entity
@Table(name = "user")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "active")
    private boolean isActive;

    @OneToOne(mappedBy = "user")
    private Player player;
}
