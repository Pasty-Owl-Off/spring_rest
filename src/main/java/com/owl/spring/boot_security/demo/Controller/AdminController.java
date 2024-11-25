package com.owl.spring.boot_security.demo.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @GetMapping(value = "/")
    public String printUsersTable() {
        return "/admin/index";
    }

    @GetMapping(value = "/user_information")
    public String profile() {
        return "/admin/user_information";
    }
}
