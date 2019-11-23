package pl.axit.ppleague.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "event_message")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class EventMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event", referencedColumnName = "id")
    @JsonManagedReference
    private Event event;

    @Column
    private String title;

    @Column
    private String message;

    @Column
    private Timestamp date;
}
