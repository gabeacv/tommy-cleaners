"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with slight parallax effect placeholder */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_clouds.png"
          alt="Luxury NYC Sky"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-charcoal uppercase tracking-[0.3em] text-sm mb-6 font-medium"
        >
          Premium NYC Cleaning
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl text-charcoal mb-8 leading-tight"
        >
          A cleaner home.<br />A calmer life.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href="#enquiry"
            className="inline-block bg-primary hover:bg-primary/80 text-charcoal px-10 py-5 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
          >
            Request an Enquiry
          </a>
        </motion.div>
      </div>

      {/* Floating scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-12 bg-charcoal/30" />
      </motion.div>
    </section>
  );
}
