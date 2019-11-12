package pl.axit.ppleague.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.goochjs.glicko2.Rating;
import org.goochjs.glicko2.RatingCalculator;

import javax.persistence.*;

@Entity
@Table(name = "player")
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

    public Player() {
        rating = RatingCalculator.DEFAULT_RATING;
        deviation = RatingCalculator.DEFAULT_DEVIATION;
        volatility =  RatingCalculator.DEFAULT_VOLATILITY;
    }

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonManagedReference
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
