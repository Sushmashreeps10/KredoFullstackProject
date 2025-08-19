package com.example.kredo.Repository;

import java.util.List;
import java.util.Optional;

import com.example.kredo.Model.KredoUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface KredoUserRepository extends JpaRepository<KredoUsers, Integer> { // <Entity, PRIMARY KEY TYPE>
    Optional<KredoUsers> findByEmail(String email);

    @Query("SELECT u from KredoUsers u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")

    List<KredoUsers> searchUsers(String keyword);
}