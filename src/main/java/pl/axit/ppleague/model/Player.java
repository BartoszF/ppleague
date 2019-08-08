package pl.axit.ppleague.model;

import lombok.*;

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

    @Column(name = "rating")
    private Double rating;
    @Column(name = "deviation")
    private Double deviation;
    @Column(name = "volatility")
    private Double volatility;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
