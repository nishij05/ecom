"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Newarrival from "./newarrival";
import Footer from "./footer";
import { useCart } from "./context/CartContext";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";

export default function Home() {
  const [data, setData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const limit = 10;
  const { addToCart } = useCart();

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/fetchProductsFromDb/get`);
      setAllProducts(res.data.products);
      setTotalProducts(res.data.totalProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    setData(filtered.slice(start, end));
    setTotalProducts(filtered.length);
  }, [searchTerm, sortOption, page, allProducts]);

  const handleNext = () => {
    if (page * limit < totalProducts) setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Newarrival />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 my-12">
          ✨ Latest Products
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="default">Sort by</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.length > 0 ? (
            data.map((item) => {
              const titleShort =
                item.title.length > 40
                  ? item.title.substring(0, 40) + "..."
                  : item.title;

              return (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-4 flex flex-col justify-between transition-transform duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-48 w-full object-contain mb-4 transition duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {titleShort}
                      </h3>
                      <p className="text-yellow-600 font-bold text-xl mt-2">
                        ${item.price}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(
                          item.id,
                          1,
                          item.title,
                          item.price,
                          item.image
                        );
                      }}
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition duration-300"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center w-full col-span-full py-10 text-gray-500">
              No products found
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center mt-12 mb-16 gap-4">
          <div className="text-gray-600">
            Page {page} — Showing {data.length} of {totalProducts} products
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className={`px-5 py-2 rounded-full shadow-md transition font-medium ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={page * limit >= totalProducts}
              className={`px-5 py-2 rounded-full shadow-md transition font-medium ${
                page * limit >= totalProducts
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
