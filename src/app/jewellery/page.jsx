"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Mens() {
  const [jewelProduct, setJewelProduct] = useState([]);

  useEffect(() => {
    axios
      .get("/api/fetchProductsFromDb/get")
      .then((res) => {
        const menData = res.data.products.filter((item) => item.category === "jewelery");
        setJewelProduct(menData);
      })
      .catch((err) => {
        console.log("Error is", err);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-4 py-8">
        {/* Banner */}
        <div className="mb-8">
          <img
            src="/banner_women.png"
            alt="Men's Collection Banner"
            className="w-full h-[250px] md:h-[400px] object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Jewelery's Collection
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {jewelProduct.map((item, index) => {
            const title =
              item.title.length > 30
                ? item.title.substring(0, 30) + "..."
                : item.title;

            return (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
              >
                <Link href={`/product/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full object-contain p-4 hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">
                    {title}
                  </h3>
                  <p className="text-lg font-bold text-gray-800 mb-4">
                    ${item.price}
                  </p>
                  <button
                    onClick={() => console.log("Added to cart")}
                    className="mt-auto bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center transition-all"
                  >
                    <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore More */}
        <div className="text-center mt-10">
          <Link href="/">
            <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-200 transition">
              Explore More
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Mens;
