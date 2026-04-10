"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
      <div className="w-full md:w-1/2 aspect-[4/5] relative rounded-lg overflow-hidden shadow-2xl">
        <Image
          src="/images/tommy_portrait.png"
          alt="Tommy, Owner of Tommy Cleaners"
          fill
          className="object-cover"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full md:w-1/2 flex flex-col items-start gap-8"
      >
        <p className="text-primary tracking-widest uppercase text-sm font-semibold">Our Story</p>
        <h2 className="text-5xl md:text-6xl text-charcoal">Cleanliness is personal.</h2>
        
        <div className="text-xl md:text-2xl text-charcoal leading-relaxed font-light flex flex-col gap-6">
          <p>
            I founded Tommy Cleaners with a simple belief: your home should be a sanctuary, not a chore list. After seeing how jarring it can be to have strangers in your space, I wanted to build a service that prioritizes relationship and trust over everything else. 
          </p>
          <p>
            We don't just send "a cleaner." We send a dedicated professional who learns your preferences, knows your space, and respects your privacy. By focusing on a small group of premium residential and corporate clients in NYC, we ensure that every visit feels consistent, thoughtful, and transformative. It's not just about removing dust; it's about restoring your peace of mind.
          </p>
        </div>

        <p className="font-cursive text-4xl text-charcoal mt-4">— Tommy</p>
      </motion.div>
    </section>
  );
}
