package com.example.kredo.Repository;

import com.example.kredo.Model.KredoOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KredoOrderRepository extends JpaRepository<KredoOrder, Long> {
    List<KredoOrder> findByCustomerEmail(String customerEmail);   // assuming "email" is a field in KredoOrder

}