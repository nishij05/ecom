"use client";

import React, { useState, useEffect, useState } from "react";

const slides = [
  {
    title: "New Arrivals Only",
    subtitle: "Collections for everyone",
    tag: "New",
    image: "/hero1.png",
  },
  {
    title: "Explore the Trends",
    subtitle: "Style that speaks",
    tag: "Hot",
    image: "/hero2.png",
  },
  {
    title: "Unleash Your Style",
    subtitle: "The ultimate fashion drop",
    tag: "Drop",
    image: "/hero3.png",
  },
];

export default function Newarrival() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setImageError(false); // Reset image error on slide change
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="m-4 md:m-8 rounded-2xl overflow-hidden shadow-xl">
      <div className="relative w-full h-[80vh] flex items-center justify-center">
        {/* Background Video */}
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            className="absolute w-full h-full object-cover z-0"
            onError={() => setVideoError(true)}
          >
            <source src="/fashion.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src="/hero1.png"
            alt="Fallback Background"
            className="absolute w-full h-full object-cover z-0"
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Slide Content */}
        <div className="relative z-20 w-full px-4 md:px-16 flex flex-col md:flex-row items-center justify-between gap-x-20">
          {/* Left Side */}
          <div className="md:w-1/2 text-white text-left space-y-4">
            <div className="inline-flex items-center justify-start">
              <span className="bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full mr-3">
                {slide.tag}
              </span>
              <img src="/hand_icon.png" alt="Hand Icon" className="w-8 h-8" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold drop-shadow">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-yellow-100">
              {slide.subtitle}
            </p>

            <div className="flex items-center justify-start gap-4 mt-6">
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition">
                Shop Now
              </button>
              <img src="/arrow.png" alt="Arrow" className="w-6 h-6 invert" />
            </div>
          </div>

          {/* Right Side (Image) */}
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-end">
            {!imageError ? (
              <img
                src={slide.image}
                alt="Slide"
                onError={() => setImageError(true)}
                className="h-[0px] object-contain drop-shadow-2xl saturate-150 transition duration-500"
              />
            ) : (
              <div className="text-white text-center p-10">
                <p className="text-sm text-gray-300">Image failed to load</p>
              </div>
            )}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 flex gap-3 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === currentSlide ? "bg-yellow-400" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
