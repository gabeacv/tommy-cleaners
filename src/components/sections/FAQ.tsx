"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Do you offer hourly rates?",
    answer: "No, we provide a transparent, all-inclusive quote based on the size and frequency of your cleaning. This ensures our cleaners are focused on quality, not the clock."
  },
  {
    question: "What is the frequency of cleaning?",
    answer: "Most of our clients prefer weekly or bi-weekly visits to maintain consistent hygiene and order. We also offer specialized schedules for corporate spaces."
  },
  {
    question: "Will I have the same cleaner every time?",
    answer: "Yes, we pride ourselves on building trust and relationships. You'll be assigned a dedicated cleaner who learns your home inside and out."
  },
  {
    question: "Do you clean offices?",
    answer: "Yes, we provide premium cleaning services for both high-end residential apartments and corporate offices across Manhattan."
  },
  {
    question: "What areas do you cover?",
    answer: "Currently, we provide dedicated cleaning services to all neighborhoods within New York City (Manhattan)."
  },
  {
    question: "How do I get a quote?",
    answer: "We require a quick 20-30 minute walkthrough of your space to provide an accurate, tailored quote that meets your specific expectations."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-transparent py-24 md:py-32 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl text-charcoal mb-16 text-center italic font-cursive">Questions.</h2>
        
        <div className="w-full flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button 
                className="w-full text-left px-8 py-6 flex items-center justify-between group"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <h3 className="text-xl md:text-2xl text-charcoal font-medium group-hover:text-primary transition-colors">{faq.question}</h3>
                <Plus className={`w-6 h-6 text-primary transition-transform duration-500 ${openIndex === idx ? "rotate-45" : "rotate-0"}`} />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out px-8 text-neutral-600 text-lg leading-relaxed ${openIndex === idx ? "max-h-96 pb-8" : "max-h-0"}`}
              >
                <div className="border-t border-primary/10 pt-6">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
