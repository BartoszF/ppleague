package pl.axit.ppleague.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "event_match")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class EventMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event", referencedColumnName = "id")
    @JsonManagedReference
    private Event event;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "player_a", referencedColumnName = "id")
    private Player playerA;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "player_b", referencedColumnName = "id")
    private Player playerB;

    @Column(name = "player_a_score")
    private Integer playerAScore;

    @Column(name = "player_b_score")
    private Integer playerBScore;

    @Column
    private Timestamp date;
}
