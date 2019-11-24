package pl.axit.ppleague.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "match")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "player_a", referencedColumnName = "id")
    private Player playerA;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "player_b", referencedColumnName = "id")
    private Player playerB;

    @Column(name = "player_a_score")
    private Integer playerAScore;

    @Column(name = "player_b_score")
    private Integer playerBScore;

    @Column
    private Timestamp date;
}
