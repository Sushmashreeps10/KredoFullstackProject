import React, { useState } from "react";
import { X, CreditCard, Wallet, Landmark, CheckCircle } from "lucide-react";
import {jwtDecode} from "jwt-decode";

const API_BASE_URL = "http://localhost:8080";

const CheckoutModal = ({ isOpen, onClose, cart }) => {
    const [step, setStep] = useState("address");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsList = cart.map(item => `${item.name} x${item.quantity}`).join(", ");

    const handleConfirmOrder = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("User not logged in");
            }

            const decoded = jwtDecode(token);
            const customerName = decoded.name || "Guest";
            const customerEmail = decoded.sub || decoded.email || "guest@example.com";

            const orderData = {
                customerEmail,
                customerName,
                items: itemsList,
                totalPrice,
                status: "Pending",
            };

            const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error("Failed to place order");
            }

            setStep("success");
        } catch (err) {
            console.error("Order error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const PaymentOption = ({ method, icon, label }) => (
        <button
            onClick={() => setPaymentMethod(method)}
            className={`payment-option ${paymentMethod === method ? "active" : ""}`}
        >
            {icon}
            <span className="payment-label">{label}</span>
        </button>
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button onClick={onClose} className="modal-close-btn absolute-close">
                        <X />
                    </button>
                    {step === "address" && <h2 className="modal-title">Delivery Details</h2>}
                    {step === "payment" && <h2 className="modal-title">Choose Payment Method</h2>}
                </div>

                {step === "address" && (
                    <form
                        className="checkout-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setStep("payment");
                        }}
                    >
                        <input type="text" placeholder="Full Name" required />
                        <textarea placeholder="Shipping Address" rows="3" required />
                        <input type="text" placeholder="City" required />
                        <input type="text" placeholder="Postal Code" required />
                        <button type="submit" className="btn btn-buy-now">
                            Continue to Payment
                        </button>
                    </form>
                )}

                {step === "payment" && (
                    <div className="payment-step">
                        <div className="payment-options">
                            <PaymentOption method="card" icon={<CreditCard />} label="Credit/Debit Card" />
                            <PaymentOption method="upi" icon={<Wallet />} label="UPI Payment" />
                            <PaymentOption method="cod" icon={<Landmark />} label="Cash on Delivery" />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button onClick={handleConfirmOrder} className="btn btn-confirm-order" disabled={loading}>
                            {loading ? "Placing Order..." : "Confirm Order"}
                        </button>
                        <button onClick={() => setStep("address")} className="back-button">
                            Back to Address
                        </button>
                    </div>
                )}

                {step === "success" && (
                    <div className="success-step">
                        <CheckCircle className="success-icon" />
                        <h2 className="success-title">Order Placed!</h2>
                        <p>Thank you for your purchase.</p>
                        <button onClick={onClose} className="btn btn-close-success">
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
