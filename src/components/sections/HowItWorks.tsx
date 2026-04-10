"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Enquiry",
    description: "Tell us a bit about your space and what you're looking for via our enquiry form."
  },
  {
    number: "02",
    title: "The Walkthrough",
    description: "Tommy or a senior lead visits for a 30-minute walkthrough to understand your preferences."
  },
  {
    number: "03",
    title: "Agreed Rate",
    description: "Receive a transparent, all-inclusive quote based on the size and frequency of your cleaning."
  },
  {
    number: "04",
    title: "Dedicated Cleaner",
    description: "We match you with a permanent cleaner who learns your home inside and out."
  }
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-cloud py-24 md:py-32 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl text-charcoal mb-16 md:mb-24 text-center">Seamlessly scheduled.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col gap-6"
            >
              <span className="text-6xl text-primary font-bold opacity-30 select-none">{step.number}</span>
              <h3 className="text-3xl md:text-4xl text-charcoal font-cursive italic tracking-tight">{step.title}</h3>
              <p className="text-charcoal/70 text-lg leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
