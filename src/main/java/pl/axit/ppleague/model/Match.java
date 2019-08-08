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
    @Column(name = "id")
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "player_a", referencedColumnName = "id")
    private Player playerA;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "player_b", referencedColumnName = "id")
    private Player playerB;

    @Column
    private Integer playerAScore;

    @Column
    private Integer playerBScore;

    @Column
    private Timestamp date;
}
