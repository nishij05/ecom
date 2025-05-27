"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../components/context/CartContext";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { cart, loading } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setDropdownOpen(false);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo_big.png" alt="Logo" className="w-10 h-10" />
          <p className="text-xl font-bold text-gray-800">SHOPIFY</p>
        </Link>

        {/* Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li><Link href="/" className="hover:text-yellow-500">Home</Link></li>
          <li><Link href="/mens" className="hover:text-yellow-500">Men</Link></li>
          <li><Link href="/womens" className="hover:text-yellow-500">Women</Link></li>
          <li><Link href="/jewellery" className="hover:text-yellow-500">Jewellery</Link></li>
          <li><Link href="/electronics" className="hover:text-yellow-500">Electronics</Link></li>
        </ul>

        {/* User + Cart Actions */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-700 font-medium hover:text-yellow-500 transition"
              >
                My Profile
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-40 bg-white border rounded-md shadow-md z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/signup">
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition text-sm">
                Signup
              </button>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative">
            <img src="/cart_icon.png" alt="Cart" className="w-6 h-6" />
            {!loading && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
