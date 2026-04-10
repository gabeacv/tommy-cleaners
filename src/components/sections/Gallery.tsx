"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const images = [
  "/images/gallery_1.png",
  "/images/gallery_2.png",
  "/images/gallery_1.png", // Using twice for demo grid
  "/images/gallery_2.png"
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-24 md:py-32 px-4 max-w-7xl mx-auto flex flex-col items-center">
      <h2 className="text-5xl md:text-7xl text-charcoal mb-16 md:mb-24 text-center">Pristine results.</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full h-[600px] md:h-[400px]">
        {images.map((src, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            onClick={() => setSelectedImage(src)}
            className="group relative cursor-pointer overflow-hidden rounded-lg aspect-square shadow-md"
          >
            <Image
              src={src}
              alt={`Pristine NYC Interior ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-3xl font-cursive">View</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
             <Image
                src={selectedImage}
                alt="Selected pristine NYC Interior"
                fill
                className="object-contain"
              />
          </div>
          <button 
            className="absolute top-8 right-8 text-white text-6xl font-light hover:rotate-90 transition-transform duration-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
