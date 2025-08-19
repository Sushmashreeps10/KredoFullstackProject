package com.example.kredo.Repository;

import com.example.kredo.Model.KredoUsers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailRepository extends JpaRepository<KredoUsers,Long> {
    KredoUsers findByEmail(String email);
}