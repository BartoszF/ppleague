package pl.axit.ppleague.exception;

public class UserExistsException extends EntityFound {
    public UserExistsException(String email) {
        super("User with mail " + email + " exists");
    }
}
