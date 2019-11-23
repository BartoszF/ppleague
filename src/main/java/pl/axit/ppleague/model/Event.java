package pl.axit.ppleague.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "event")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "event")
    @JsonBackReference
    private List<EventMatch> matches;

    @OneToMany(mappedBy = "event")
    @JsonBackReference
    private List<EventMessage> messages;
}
