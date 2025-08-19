package com.example.kredo.Service;

import com.example.kredo.DTO.RequestResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.kredo.Repository.KredoUserRepository;

@Service
public class KredoUserDetailsServices implements UserDetailsService {

    @Autowired
    private KredoUserRepository newUsersRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return newUsersRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

}