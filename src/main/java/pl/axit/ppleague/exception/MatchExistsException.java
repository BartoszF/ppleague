package pl.axit.ppleague.exception;

public class MatchExistsException extends EntityFound {
    public MatchExistsException() {
        super("Match exists");
    }
}
