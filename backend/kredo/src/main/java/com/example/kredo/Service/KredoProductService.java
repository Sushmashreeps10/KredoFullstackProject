package com.example.kredo.Service;

import com.example.kredo.DTO.KredoProductDTO;
import java.util.List;

public interface KredoProductService {
    KredoProductDTO createProduct(KredoProductDTO productDTO);
    KredoProductDTO updateProduct(Long id, KredoProductDTO productDTO);
    void deleteProduct(Long id);
    KredoProductDTO getProductById(Long id);
    List<KredoProductDTO> getAllProducts();
}
