package com.owl.spring.boot_security.demo.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
public class UsersController {

	@GetMapping(value = "/user_information")
	public String profile() {
		return "/user/user_information";
	}
}
