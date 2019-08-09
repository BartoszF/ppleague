package pl.axit.ppleague.exception;

import javax.persistence.EntityNotFoundException;

public class ActivationNotFound extends EntityNotFoundException {
    public ActivationNotFound(String key) {
        super("Activation " + key + " not found");
    }
}
