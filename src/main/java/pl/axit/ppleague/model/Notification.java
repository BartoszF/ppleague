package pl.axit.ppleague.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import pl.axit.ppleague.data.EventType;

import javax.persistence.*;
import javax.validation.Valid;
import java.sql.Timestamp;
import java.util.Optional;

@Entity
@Table(name = "notification")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
@Valid
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "actor_id", referencedColumnName = "id")
    @JsonManagedReference
    private User actor;

    @ManyToOne
    @JoinColumn(name = "notifier_id", referencedColumnName = "id")
    @JsonManagedReference
    private User notifier;

    @Column(name = "event_type")
    private Integer eventType;

    @Column(name = "event_target_id")
    private Long eventId;

    @Column(name = "date")
    private Timestamp date;

    @Column(name = "seen")
    private boolean seen;

    public Optional<EventType> getEventType() {
        return EventType.getById(eventType);
    }

}
