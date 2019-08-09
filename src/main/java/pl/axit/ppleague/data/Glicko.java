package pl.axit.ppleague.data;

import org.goochjs.glicko2.RatingCalculator;
import org.goochjs.glicko2.RatingPeriodResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import pl.axit.ppleague.repository.PlayerRepository;

@Component
public class Glicko {

    @Autowired
    private PlayerRepository playerRepository;

    @Bean
    public RatingCalculator getRatingCalculator() {
        return new RatingCalculator();
    }

    @Bean
    public RatingPeriodResults getRatingPeriodResults() {
        RatingPeriodResults results = new RatingPeriodResults();

        playerRepository.findAll().forEach(player -> results.addParticipants(player.getRatingObject(getRatingCalculator())));

        return results;
    }
}
