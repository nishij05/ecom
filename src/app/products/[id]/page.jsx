"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCart } from "../../components/context/CartContext";
import Header from "../../components/navbar";
import Footer from "../../components/footer";

const Product = () => {
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`/api/fetchProductsFromDb/${id}`);
        setProduct(res.data);
        setMainImage(res.data.image);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getProduct();
  }, [id]);

  if (loading)
    return <p className="text-center py-20 text-lg font-semibold">Loading...</p>;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10">
        {product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left: Images */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
                {[...Array(4)].map((_, index) => (
                  <img
                    key={index}
                    src={product.image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-yellow-500 hover:scale-105 transition cursor-pointer"
                    onClick={() => setMainImage(product.image)}
                  />
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-auto rounded-xl shadow-lg object-contain"
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              <h2 className="text-sm uppercase tracking-widest text-gray-500">
                {product.category}
              </h2>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <div className="text-yellow-600 font-medium">
                ⭐ Rating: {product.rating} / 5
              </div>
              <div className="text-3xl font-bold text-green-600">
                ${product.price}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.description}
              </p>
              <button
                className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold px-8 py-3 rounded-lg transition duration-200"
                onClick={() =>
                  addToCart(
                    product.id,
                    1,
                    product.title,
                    product.price,
                    product.image
                  )
                }
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl">Product not found</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Product;
