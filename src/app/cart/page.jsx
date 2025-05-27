"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/navbar";
import Footer from "../components/footer";
import toast from "react-hot-toast";
import { ShoppingCart, LogIn } from "lucide-react";
import { useCart } from "../components/context/CartContext";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { fetchCart } = useCart(); // Sync global cart
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    axios
      .get("/api/cart/get", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCartItems(res.data);
        setIsLoggedIn(true);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const deleteItem = (id) => {
    axios
      .delete(`/api/cart/delete/${id}`)
      .then(() => {
        setCartItems(cartItems.filter((item) => item._id !== id));
        fetchCart();
        toast.success("Item removed from cart");
      })
      .catch(() => toast.error("Failed to remove item"));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    axios
      .put(`/api/cart/put/${id}`, { quantity: newQuantity })
      .then((res) => {
        setCartItems(
          cartItems.map((item) => (item._id === id ? res.data : item))
        );
        fetchCart();
        toast.success("Quantity updated");
      })
      .catch(() => toast.error("Failed to update quantity"));
  };

  const getTotalCartAmount = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    try {
      const totalAmount = getTotalCartAmount();
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Cannot place order.");
        return;
      }
      console.log("Total Amount:", totalAmount);

      // Create Razorpay order from backend
      const response = await axios.post("/api/razorpay/create-order", {
        amount: totalAmount,
      });

      const { id: order_id, amount, currency } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "My Shop",
        description: "Purchase Products",
        order_id,
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          try {
            const successResponse = await axios.post(
              "/api/razorpay/success",
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (successResponse.data.success) {
              toast.success("Order placed successfully!");
              setCartItems([]);
              fetchCart();
              router.push("/orders");
            } else {
              toast.error("Failed to place order");
            }
          } catch (err) {
            console.error(
              "Success route error:",
              err.response?.data || err.message
            );
            toast.error("Server error while placing order.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test12@example.com",
          contact: "1234567890",
        },
        notes: {
          address: "Customer address",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Payment failed");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[70vh] p-4 md:p-10 max-w-6xl mx-auto">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center text-center bg-white p-10 rounded-xl shadow-md mt-35">
            <ShoppingCart className="w-14 h-14 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Your cart is empty.
            </h2>
            <p className="text-gray-600 mb-4">
              Please login to see your cart items.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              <LogIn className="w-4 h-4" /> Login Now
            </a>
          </div>
        ) : orderPlaced ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              🎉 Order Placed Successfully!
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-green-700">
                    ${item.price * item.quantity}
                  </p>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total:</span>
                <span>${getTotalCartAmount()}</span>
              </div>
              <button
                onClick={() => setOrderPlaced(false)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Back to Cart
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Your Shopping Cart
            </h1>
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-600">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow-sm rounded-lg border"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded mb-4 md:mb-0"
                    />
                    <div className="flex-1 md:px-6 text-center md:text-left">
                      <h2 className="font-semibold text-lg text-gray-800">
                        {item.title}
                      </h2>
                      <p className="text-gray-500 mt-1">Price: ${item.price}</p>
                      <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-green-700 mb-2">
                        ${item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mt-10 grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Promo Code</h2>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="flex-1 border px-4 py-2 rounded"
                      />
                      <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>${getTotalCartAmount()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${getTotalCartAmount()}</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
