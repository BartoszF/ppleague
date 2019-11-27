package pl.axit.ppleague.provider;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import pl.axit.ppleague.model.User;
import pl.axit.ppleague.repository.UserRepository;
import pl.axit.ppleague.service.UserService;

import java.util.ArrayList;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {
    private final UserService userService;

    private final UserRepository userRepository;

    public CustomAuthenticationProvider(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String name = authentication.getName();
        User user = userRepository.findByEmail(name).get();

        if (isAuthenticationValid(authentication, user)) {
            return new UserAuthenticationToken(
                    user, user.getPassword(), new ArrayList<>());
        } else {
            return null;
        }
    }

    public boolean isAuthenticationValid(Authentication auth, User user) {
        String password = auth.getCredentials().toString();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        return encoder.matches(password, user.getPassword());
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(
                UsernamePasswordAuthenticationToken.class);
    }
}
