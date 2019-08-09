package pl.axit.ppleague.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "user_activation")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserActivation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "activation_key")
    private String activationKey;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column
    private Timestamp date;
}
