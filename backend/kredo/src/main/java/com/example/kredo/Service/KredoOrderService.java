package com.example.kredo.Service;

import com.example.kredo.DTO.KredoOrderDTO;
import com.example.kredo.Model.KredoOrder;
import com.example.kredo.Repository.KredoOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KredoOrderService {

    @Autowired
    private KredoOrderRepository repository;

    // Create Order
    public KredoOrder createOrder(KredoOrderDTO dto) {
        KredoOrder order = new KredoOrder();
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(dto.getCustomerEmail());
        order.setItems(dto.getItems());
        order.setTotalPrice(dto.getTotalPrice());
        order.setStatus(dto.getStatus() != null ? dto.getStatus() : "PENDING");
        return repository.save(order);
    }

    public List<KredoOrder> findByCustomerEmail(String customerEmail) {
        return repository.findByCustomerEmail(customerEmail);
    }

    // Get All Orders
    public List<KredoOrder> getAllOrders() {
        return repository.findAll();
    }

    // Get Order by ID
    public KredoOrder getOrderById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update Order
    public KredoOrder updateOrder(Long id, KredoOrderDTO dto) {
        KredoOrder order = repository.findById(id).orElse(null);
        if (order != null) {
            order.setCustomerName(dto.getCustomerName());
            order.setCustomerEmail(dto.getCustomerEmail());
            order.setItems(dto.getItems());
            order.setTotalPrice(dto.getTotalPrice());
            order.setStatus(dto.getStatus());
            return repository.save(order);
        }
        return null;
    }

    // Delete Order
    public boolean deleteOrder(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}