package pl.axit.ppleague.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.Email;

@Entity
@Table(name = "user")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
@Valid
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    @Email
    private String email;

    @Column(name = "password")
    @JsonIgnore
    private String password;

    @Column(name = "active")
    private boolean isActive;

    @OneToOne(mappedBy = "user")
    @JsonBackReference
    private Player player;
}
