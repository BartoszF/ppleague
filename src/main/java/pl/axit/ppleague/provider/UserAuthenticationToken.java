package pl.axit.ppleague.provider;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import pl.axit.ppleague.model.User;

import java.util.Collection;

public class UserAuthenticationToken extends AbstractAuthenticationToken {
    private static final long serialVersionUID = 521L;
    private final User principal;
    private Object credentials;

    public UserAuthenticationToken(User principal, Object credentials) {
        super((Collection) null);
        this.principal = principal;
        this.credentials = credentials;
        this.setAuthenticated(false);
    }

    public UserAuthenticationToken(User principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.credentials = credentials;
        super.setAuthenticated(true);
    }

    public Object getCredentials() {
        return this.credentials;
    }

    public Object getPrincipal() {
        return this.principal;
    }

    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        if (isAuthenticated) {
            throw new IllegalArgumentException("Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
        } else {
            super.setAuthenticated(false);
        }
    }

    public void eraseCredentials() {
        super.eraseCredentials();
        this.credentials = null;
    }
}
