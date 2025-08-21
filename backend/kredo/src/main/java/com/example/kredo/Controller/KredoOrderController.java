package com.example.kredo.Controller;

import com.example.kredo.DTO.KredoOrderDTO;
import com.example.kredo.Model.KredoOrder;
import com.example.kredo.Service.KredoOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class KredoOrderController {

    @Autowired
    private KredoOrderService service;

    @PostMapping("/create")
    public ResponseEntity<KredoOrder> createOrder(@RequestBody KredoOrderDTO dto) {
        return ResponseEntity.ok(service.createOrder(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<KredoOrder>> getAllOrders() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<KredoOrder> getOrderById(@PathVariable Long id) {
        KredoOrder order = service.getOrderById(id);
        if (order != null) return ResponseEntity.ok(order);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-by-email/{customerEmail}")
    public ResponseEntity<List<KredoOrder>> findByCustomerEmail(@PathVariable String customerEmail) {
        List<KredoOrder> orders = service.findByCustomerEmail(customerEmail);
        if (orders.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/get-by-id/{id}")
    public ResponseEntity<KredoOrder> updateOrder(@PathVariable Long id, @RequestBody KredoOrderDTO dto) {
        KredoOrder updated = service.updateOrder(id, dto);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        boolean deleted = service.deleteOrder(id);
        if (deleted) return ResponseEntity.ok("Order deleted successfully");
        return ResponseEntity.notFound().build();
    }
}
