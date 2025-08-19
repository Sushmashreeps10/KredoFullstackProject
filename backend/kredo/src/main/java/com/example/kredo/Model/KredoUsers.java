package com.example.kredo.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Table(name = "kredo_users")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KredoUsers implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String email;
    private String password;
    private String role;



    // account status
    private boolean active;



    // account created
    private LocalDateTime createdAt = LocalDateTime.now();
    // account updated
    private LocalDateTime updatedAt = LocalDateTime.now();

    private String otp;
    private boolean verified;
    @Override
    public String getUsername() {
        return email; // Assuming email is used as the username
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> role); // Assuming role is a single authority
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Default implementation
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Default implementation
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Default implementation
    }

    @Override
    public boolean isEnabled() {
        return true; // Default implementation
    }
}

