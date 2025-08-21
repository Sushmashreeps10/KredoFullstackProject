package com.example.kredo.Repository;

import com.example.kredo.Model.KredoProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KredoProductRepository extends JpaRepository<KredoProduct, Long> {
}
