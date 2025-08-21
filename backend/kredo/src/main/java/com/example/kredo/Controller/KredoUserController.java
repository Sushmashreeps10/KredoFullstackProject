package com.example.kredo.Controller;

import com.example.kredo.Service.EmailUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.kredo.DTO.RequestResponse;
import com.example.kredo.Model.KredoUsers;
import com.example.kredo.Service.KredoUsersManagementService;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class KredoUserController {
    @Autowired
    private KredoUsersManagementService usersManagementService;

    @PostMapping("/register")
    public ResponseEntity<RequestResponse> registerUser(@RequestBody RequestResponse reg) {
        return ResponseEntity.ok(usersManagementService.registerUser(reg));
    }

    @PostMapping("/login")
    public ResponseEntity<RequestResponse> login(@RequestBody RequestResponse req) {
        return ResponseEntity.ok(usersManagementService.login(req));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<RequestResponse> refreshToken(@RequestBody RequestResponse req) {
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    @GetMapping("/auth/get-my-info")
    public ResponseEntity<RequestResponse> getMyInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        RequestResponse response = usersManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<RequestResponse> getAllUsers() {
        return ResponseEntity.ok(usersManagementService.getAllUsers());

    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<RequestResponse> getUSerByID(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));

    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<RequestResponse> updateUser(@PathVariable Integer userId,
                                                      @RequestBody KredoUsers RequestResponse) {
        return ResponseEntity.ok(usersManagementService.updateUser(userId, RequestResponse));
    }

    @GetMapping("/user/get-profile")
    public ResponseEntity<RequestResponse> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        RequestResponse response = usersManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<RequestResponse> deleteUSer(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

    // Search users
    @GetMapping("/users/search")
    public ResponseEntity<List<KredoUsers>> searchProducts(@RequestParam String keyword) {
        List<KredoUsers> products = usersManagementService.searchUsers(keyword);
        System.out.println("searching with :" + keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}