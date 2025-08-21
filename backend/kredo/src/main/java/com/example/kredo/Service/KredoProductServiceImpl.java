package com.example.kredo.Service;

import com.example.kredo.DTO.KredoProductDTO;
import com.example.kredo.Model.KredoProduct;
import com.example.kredo.Repository.KredoProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KredoProductServiceImpl implements KredoProductService {

    @Autowired
    private KredoProductRepository productRepository;

    private KredoProductDTO mapToDTO(KredoProduct product) {
        KredoProductDTO dto = new KredoProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setCategory(product.getCategory());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setImageUrl(product.getImageUrl());
        dto.setDescription(product.getDescription());
        return dto;
    }

    private KredoProduct mapToEntity(KredoProductDTO dto) {
        KredoProduct product = new KredoProduct();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setImageUrl(dto.getImageUrl());
        product.setDescription(dto.getDescription());
        return product;
    }

    @Override
    public KredoProductDTO createProduct(KredoProductDTO productDTO) {
        KredoProduct product = mapToEntity(productDTO);
        return mapToDTO(productRepository.save(product));
    }

    @Override
    public KredoProductDTO updateProduct(Long id, KredoProductDTO productDTO) {
        KredoProduct existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setName(productDTO.getName());
        existing.setCategory(productDTO.getCategory());
        existing.setPrice(productDTO.getPrice());
        existing.setStockQuantity(productDTO.getStockQuantity());
        existing.setImageUrl(productDTO.getImageUrl());
        existing.setDescription(productDTO.getDescription());
        return mapToDTO(productRepository.save(existing));
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public KredoProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public List<KredoProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
