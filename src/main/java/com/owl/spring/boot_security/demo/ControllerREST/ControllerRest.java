package com.owl.spring.boot_security.demo.ControllerREST;

import com.owl.spring.boot_security.demo.Models.User;
import com.owl.spring.boot_security.demo.Service.RegistrationService;
import com.owl.spring.boot_security.demo.Service.UserService;
import com.owl.spring.boot_security.demo.util.UserValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ControllerRest {

    private final UserService userService;
    private final UserValidator userValidator;
    private final RegistrationService registrationService;

    public ControllerRest(UserService userService, UserValidator userValidator,
                          RegistrationService registrationService) {
        this.userService = userService;
        this.userValidator = userValidator;
        this.registrationService =registrationService;
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

    @PostMapping("/update")
    public ResponseEntity<?> userUpdate(@RequestBody @Valid User user,
                                                                BindingResult bindingResult) {
        user.setPasswordConfirm(user.getPassword());
        userValidator.validate(user, bindingResult);
        if (!bindingResult.hasErrors()) {
            registrationService.update(user);
            return ResponseEntity.ok("Update successfully");
        } else {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return ResponseEntity.badRequest().body(errors);
        }
    }
}
