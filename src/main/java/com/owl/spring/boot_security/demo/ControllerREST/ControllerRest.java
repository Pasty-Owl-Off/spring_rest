package com.owl.spring.boot_security.demo.ControllerREST;

import com.owl.spring.boot_security.demo.Models.User;
import com.owl.spring.boot_security.demo.Service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ControllerRest {

    private final UserService userService;

    public ControllerRest(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> users() {
        return userService.list();
    }

    @GetMapping("/user")
    public User userById(@RequestParam("id") long id) {
        return userService.findById(id);
    }

    @GetMapping("/auth_user")
    public User userAuth(@AuthenticationPrincipal User user) {
        return user;
    }

    @GetMapping("/new_user")
    public User userNew() {
        return new User();
    }
}
