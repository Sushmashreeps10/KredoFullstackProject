package com.example.kredo.DTO;

import java.time.LocalDateTime;

public class KredoOrderDTO {
    private Long orderId;
    private String customerName;
    private String customerEmail;
    private String items;
    private Double totalPrice;
    private LocalDateTime orderDate;
    private String status;

    // Getters & Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getItems() { return items; }
    public void setItems(String items) { this.items = items; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
