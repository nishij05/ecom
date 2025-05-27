"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token || token.length < 10) {
      console.warn("No valid token found when fetching cart.");
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("/api/cart/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data || []);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (id, quantity, title, price, image) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add items to your cart.");
      window.location.href = "/login";
      return;
    }

    const existingProduct = cart.find((item) => item.id === id);
    let updatedCart;

    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [...cart, { id, title, price, image, quantity }];
    }

    setCart(updatedCart);

    try {
      await axios.post(
        "/api/cart/post",
        { id, title, price, image, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add item to backend", error);
      toast.error("Failed to sync cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, fetchCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
