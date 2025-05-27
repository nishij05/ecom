"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/navbar";
import Footer from "../components/footer";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your orders");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/orders/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data.orders); // Assuming backend returns `{ orders: [...] }`
      } catch (error) {
        console.error("Failed to fetch orders", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10 min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id || index}
                className="bg-white p-6 rounded-lg shadow border"
              >
                <h2 className="text-xl font-semibold mb-2">
                  Order ID: {order._id}
                </h2>
                <p className="text-gray-500 mb-1">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 font-medium mb-4">
                  Status: {order.status}
                </p>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-700">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 font-bold text-lg">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
