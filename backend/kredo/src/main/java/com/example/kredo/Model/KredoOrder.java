package com.example.kredo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "kredo_orders")
public class KredoOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private String customerName;
    private String customerEmail;
    private String items; // Comma-separated product names OR JSON (simpler first)
    private Double totalPrice;
    private LocalDateTime orderDate;
    private String status; // e.g., "PENDING", "DELIVERED", "CANCELLED"

    public KredoOrder() {
        this.orderDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    public String getCustomerEmail() {
        return customerEmail;
    }
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    public String getItems() {
        return items;
    }
    public void setItems(String items) {
        this.items = items;
    }
    public Double getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
    public LocalDateTime getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
