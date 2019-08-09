package pl.axit.ppleague.model;

import lombok.*;
import org.goochjs.glicko2.Rating;
import org.goochjs.glicko2.RatingCalculator;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    public Rating getRatingObject(RatingCalculator ratingCalculator) {
        return new Rating("" + getId(), ratingCalculator, getRating(), getDeviation(), getVolatility());
    }

    public void saveFromRatingObject(Rating rating) {
        setRating(rating.getRating());
        setVolatility(rating.getVolatility());
        setDeviation(rating.getRatingDeviation());
    }

}
