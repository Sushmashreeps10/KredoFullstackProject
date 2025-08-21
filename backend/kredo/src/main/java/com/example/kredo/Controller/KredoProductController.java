package com.example.kredo.Controller;

import com.example.kredo.DTO.KredoProductDTO;
import com.example.kredo.Service.KredoProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class KredoProductController {

    @Autowired
    private KredoProductService productService;

    // Admin only
    @PostMapping("/create")
    public KredoProductDTO createProduct(@RequestBody KredoProductDTO dto) {
        return productService.createProduct(dto);
    }

    // Admin only
    @PutMapping("/update/{id}")
    public KredoProductDTO updateProduct(@PathVariable Long id, @RequestBody KredoProductDTO dto) {
        return productService.updateProduct(id, dto);
    }

    // Admin only
    @DeleteMapping("/delete/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    // User + Admin
    @GetMapping("/get-by-id/{id}")
    public KredoProductDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // User + Admin
    @GetMapping("/all")
    public List<KredoProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }
}
