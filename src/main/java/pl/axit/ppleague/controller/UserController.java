package pl.axit.ppleague.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.axit.ppleague.data.request.CreateUserRequest;
import pl.axit.ppleague.exception.UserExistsException;
import pl.axit.ppleague.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public void createUser(@RequestBody CreateUserRequest request) throws UserExistsException {
        userService.createUser(request);
    }

    @GetMapping("/activate/{key}")
    public void activateUser(@PathVariable("key") String key) {
        userService.activateUser(key);
    }
}
