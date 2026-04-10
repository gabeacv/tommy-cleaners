"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const enquirySchema = z.object({
  first_name: z.string().min(2, "First name is too short"),
  last_name: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  property_type: z.enum(["Residential", "Corporate"]),
  area: z.string().min(2, "Please specify your area (NYC)"),
  message: z.string().min(10, "Please provide more details"),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export default function EnquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
        property_type: "Residential"
    }
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Submission failed");

      setIsSubmitted(true);
      reset();
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="enquiry" className="py-24 md:py-32 px-4 max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <h2 className="text-5xl md:text-7xl mb-8 font-cursive text-primary">Thank you.</h2>
          <p className="text-xl md:text-2xl text-charcoal/70 leading-relaxed mb-12">
            We've received your enquiry and Tommy will reach out personally within 24 hours to schedule a walkthrough.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-primary font-medium hover:underline"
          >
            Send another enquiry
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="enquiry" className="py-24 md:py-32 px-4 max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16 md:mb-24">
        <h2 className="text-5xl md:text-7xl text-charcoal italic font-cursive mb-6">Let's talk.</h2>
        <p className="text-xl text-charcoal/70 max-w-xl">
          Complete the form below to begin the process. We respond to all enquiries within one business day.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-widest font-semibold text-charcoal/60">First Name</label>
          <input 
            {...register("first_name")} 
            className={`bg-cloud border-b-2 p-4 text-lg focus:outline-none focus:border-primary transition-colors ${errors.first_name ? 'border-red-300' : 'border-neutral-100'}`}
          />
          {errors.first_name && <span className="text-red-400 text-sm">{errors.first_name.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-widest font-semibold text-charcoal/60">Last Name</label>
          <input 
            {...register("last_name")} 
            className={`bg-cloud border-b-2 p-4 text-lg focus:outline-none focus:border-primary transition-colors ${errors.last_name ? 'border-red-300' : 'border-neutral-100'}`}
          />
          {errors.last_name && <span className="text-red-400 text-sm">{errors.last_name.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-widest font-semibold text-charcoal/60">Email Address</label>
          <input 
            {...register("email")} 
            className={`bg-cloud border-b-2 p-4 text-lg focus:outline-none focus:border-primary transition-colors ${errors.email ? 'border-red-300' : 'border-neutral-100'}`}
          />
          {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-widest font-semibold text-charcoal/60">Phone Number</label>
          <input 
            {...register("phone")} 
            className={`bg-cloud border-b-2 p-4 text-lg focus:outline-none focus:border-primary transition-colors ${errors.phone ? 'border-red-300' : 'border-neutral-100'}`}
          />
          {errors.phone && <span className="text-red-400 text-sm">{errors.phone.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-widest font-semibold text-charcoal/60">Property Type</label>
          <select 
            {...register("property_type")} 
            className="bg-cloud border-b-2 border-neutral-100 p-4 text-lg focus:outline-none focus:border-primary transition-colors appearance-none"
          >
            <option value="Residential">Residential</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-widest font-semibold text-charcoal/60">Area in NYC</label>
          <input 
            {...register("area")} 
            placeholder="e.g. Upper West Side"
            className={`bg-cloud border-b-2 p-4 text-lg focus:outline-none focus:border-primary transition-colors ${errors.area ? 'border-red-300' : 'border-neutral-100'}`}
          />
          {errors.area && <span className="text-red-400 text-sm">{errors.area.message}</span>}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm uppercase tracking-widest font-semibold text-charcoal/60">Message</label>
          <textarea 
            {...register("message")} 
            rows={4}
            placeholder="Tell us about your space, bedrooms, frequency..."
            className={`bg-cloud border-b-2 p-4 text-lg focus:outline-none focus:border-primary transition-colors ${errors.message ? 'border-red-300' : 'border-neutral-100'}`}
          />
          {errors.message && <span className="text-red-400 text-sm">{errors.message.message}</span>}
        </div>

        <div className="md:col-span-2 flex flex-col items-center gap-6 mt-8">
          {error && <p className="text-red-500 font-medium">{error}</p>}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`bg-primary hover:bg-primary/80 text-charcoal px-16 py-6 rounded-full text-xl font-medium transition-all duration-300 shadow-xl w-full md:w-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
          >
            {isSubmitting ? "Sending..." : "Send enquiry"}
          </button>
        </div>
      </form>
    </section>
  );
}
