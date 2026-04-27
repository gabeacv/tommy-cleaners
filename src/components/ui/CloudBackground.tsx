"use client";

import React from "react";

/**
 * Tommy Cleaners — Animated Cloud Background
 * 
 * High-performance, pure CSS animation for floating clouds.
 * 3 layers of depth for parallax effect with realistic shapes.
 * Respects prefers-reduced-motion.
 */

const CLOUD_VARIANTS = [
  // Variant 0: Large Puffy
  "M20,50 C15,50 12,45 12,40 C12,30 25,25 30,25 C35,10 55,10 65,25 C75,25 88,30 88,40 C88,50 80,55 70,55 L30,55 C25,55 20,50 20,50 Z",
  // Variant 1: Long Drifted
  "M10,45 C10,35 20,30 28,30 C30,20 45,15 55,25 C65,15 85,20 85,35 C85,45 75,50 65,50 L25,50 C15,50 10,45 10,45 Z",
  // Variant 2: Compact Organic
  "M15,40 C15,30 25,25 32,25 C35,12 55,12 60,25 C70,25 80,30 80,40 C80,48 70,52 60,52 L30,52 C20,52 15,48 15,40 Z"
];

const Cloud = ({ 
  variant, 
  className, 
  style, 
  bobDelay = "0s" 
}: { 
  variant: number; 
  className?: string; 
  style?: React.CSSProperties;
  bobDelay?: string;
}) => (
  <div className={`animate-cloud-bob ${className}`} style={{ ...style, animationDelay: bobDelay }}>
    <svg 
      viewBox="0 0 100 60" 
      fill="currentColor" 
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={CLOUD_VARIANTS[variant % CLOUD_VARIANTS.length]} />
    </svg>
  </div>
);

export function CloudBackground() {
  return (
    <div 
      id="cloud-background"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" 
      aria-hidden="true"
    >
      <div className="relative w-full h-full opacity-90">
        {/* Layer 1: Far — Slowest, smallest, blurred */}
        <div className="absolute top-[5%] left-0 w-40 h-20 text-white/70 animate-cloud-far cloud-blur-md will-change-transform" style={{ animationDelay: '0s' }}>
          <Cloud variant={0} bobDelay="0s" />
        </div>
        <div className="absolute top-[20%] left-0 w-32 h-16 text-white/70 animate-cloud-far cloud-blur-md will-change-transform" style={{ animationDelay: '-40s' }}>
          <Cloud variant={1} bobDelay="-2s" />
        </div>
        <div className="absolute top-[35%] left-0 w-36 h-18 text-white/70 animate-cloud-far cloud-blur-md will-change-transform" style={{ animationDelay: '-80s' }}>
          <Cloud variant={2} bobDelay="-4s" />
        </div>
        <div className="absolute top-[50%] left-0 w-28 h-14 text-white/70 animate-cloud-far cloud-blur-md will-change-transform" style={{ animationDelay: '-100s' }}>
          <Cloud variant={0} bobDelay="-1s" />
        </div>

        {/* Layer 2: Mid — Medium speed, slightly blurred */}
        <div className="absolute top-[62%] left-0 w-64 h-32 text-white/85 animate-cloud-mid cloud-blur-sm will-change-transform" style={{ animationDelay: '-15s' }}>
          <Cloud variant={1} bobDelay="-3s" />
        </div>
        <div className="absolute top-[73%] left-0 w-56 h-28 text-white/85 animate-cloud-mid cloud-blur-sm will-change-transform" style={{ animationDelay: '-50s' }}>
          <Cloud variant={2} bobDelay="-1s" />
        </div>
        <div className="absolute top-[83%] left-0 w-60 h-30 text-white/85 animate-cloud-mid cloud-blur-sm will-change-transform" style={{ animationDelay: '-30s' }}>
          <Cloud variant={0} bobDelay="-5s" />
        </div>

        {/* Layer 3: Near — Fastest, largest, clear */}
        <div className="absolute top-[12%] left-0 w-96 h-48 text-white/95 animate-cloud-near will-change-transform" style={{ animationDelay: '-5s' }}>
          <Cloud variant={2} bobDelay="-2s" />
        </div>
        <div className="absolute top-[45%] left-0 w-80 h-40 text-white/95 animate-cloud-near will-change-transform" style={{ animationDelay: '-35s' }}>
          <Cloud variant={1} bobDelay="-4s" />
        </div>
        <div className="absolute top-[28%] left-0 w-[500px] h-64 text-white/50 animate-cloud-near cloud-blur-lg will-change-transform" style={{ animationDelay: '-20s' }}>
          <Cloud variant={0} bobDelay="-6s" />
        </div>
      </div>
    </div>
  );
}
