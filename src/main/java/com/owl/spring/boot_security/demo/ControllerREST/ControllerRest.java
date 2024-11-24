package com.owl.spring.boot_security.demo.ControllerREST;

import com.owl.spring.boot_security.demo.Models.Role;
import com.owl.spring.boot_security.demo.Models.User;
import com.owl.spring.boot_security.demo.Service.RegistrationService;
import com.owl.spring.boot_security.demo.Service.RoleService;
import com.owl.spring.boot_security.demo.Service.UserService;
import com.owl.spring.boot_security.demo.util.UserValidator;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
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
    private final RoleService roleService;

    public ControllerRest(UserService userService, UserValidator userValidator,
                          RegistrationService registrationService, RoleService roleService) {
        this.userService = userService;
        this.userValidator = userValidator;
        this.registrationService =registrationService;
        this.roleService = roleService;
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

    @PostMapping("/new")
    public ResponseEntity<?> userNew(@RequestBody @Valid User user,
                                        BindingResult bindingResult) {
        userValidator.validate(user, bindingResult);
        if (!bindingResult.hasErrors()) {
            registrationService.registration(user);
            return ResponseEntity.ok("Added successfully");
        } else {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return ResponseEntity.badRequest().body(errors);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<HttpStatus> userDelete(@RequestBody long id) {
        userService.remove(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping("/roles")
    public List<Role> roles() {
        return roleService.listRole();
    }
}
