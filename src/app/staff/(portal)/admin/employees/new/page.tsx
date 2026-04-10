"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

const NewEmployeeSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  role: z.enum(['admin', 'employee'])
});

type FormData = z.infer<typeof NewEmployeeSchema>;

export default function NewEmployeePage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(NewEmployeeSchema),
    defaultValues: {
      role: 'employee'
    }
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const response = await fetch("/api/staff/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create employee");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/staff/admin/employees");
      }, 2000);
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-cursive text-charcoal">Welcome to the Team!</h1>
        <p className="text-charcoal/40 italic">Employee account created successfully. Redirecting you back...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Link 
        href="/staff/admin/employees" 
        className="inline-flex items-center gap-2 text-charcoal/40 hover:text-charcoal transition-colors mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium tracking-widest uppercase">Back to Team</span>
      </Link>

      <header className="mb-16">
        <h1 className="text-5xl font-cursive text-charcoal mb-4">Add New Staff</h1>
        <p className="text-charcoal/40 text-lg italic">Expand the Tommy Cleaners family with high-end talent.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-charcoal/5 flex flex-col gap-10">
          
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            
            {/* Full Name */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 flex items-center gap-2">
                <User size={12} /> Full Name
              </label>
              <input 
                {...register("full_name")}
                className={`bg-cloud px-8 py-4 rounded-2xl focus:outline-shadow focus:ring-1 transition-all duration-300 ${errors.full_name ? 'ring-red-400 border-red-400' : 'focus:ring-primary'}`}
                placeholder="Emma Watson"
              />
              {errors.full_name && <p className="text-red-400 text-xs italic">{errors.full_name.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 flex items-center gap-2">
                <Mail size={12} /> Email Address
              </label>
              <input 
                {...register("email")}
                type="email"
                className={`bg-cloud px-8 py-4 rounded-2xl focus:outline-shadow focus:ring-1 transition-all duration-300 ${errors.email ? 'ring-red-400 border-red-400' : 'focus:ring-primary'}`}
                placeholder="emma@tommycleaners.com"
              />
              {errors.email && <p className="text-red-400 text-xs italic">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 flex items-center gap-2">
                <Phone size={12} /> Phone Number
              </label>
              <input 
                {...register("phone")}
                className={`bg-cloud px-8 py-4 rounded-2xl focus:outline-shadow focus:ring-1 transition-all duration-300 ${errors.phone ? 'ring-red-400 border-red-400' : 'focus:ring-primary'}`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <p className="text-red-400 text-xs italic">{errors.phone.message}</p>}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 flex items-center gap-2">
                <Shield size={12} /> Access Role
              </label>
              <select 
                {...register("role")}
                className="bg-cloud px-8 py-4 rounded-2xl focus:outline-shadow focus:ring-1 focus:ring-primary transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="employee">Employee</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-3 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 flex items-center gap-2">
                <MapPin size={12} /> Home Address / Office Location
              </label>
              <input 
                {...register("address")}
                className={`bg-cloud px-8 py-4 rounded-2xl focus:outline-shadow focus:ring-1 transition-all duration-300 ${errors.address ? 'ring-red-400 border-red-400' : 'focus:ring-primary'}`}
                placeholder="Brooklyn Heights, NY"
              />
              {errors.address && <p className="text-red-400 text-xs italic">{errors.address.message}</p>}
            </div>

          </div>

          {serverError && (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start gap-4 text-red-900 animate-in slide-in-from-top-4 duration-300">
              <AlertCircle size={20} className="shrink-0 mt-1" />
              <div className="flex flex-col gap-1">
                <p className="font-bold text-sm">Action Failed</p>
                <p className="text-sm italic">{serverError}</p>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-charcoal/5">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-charcoal hover:shadow-2xl active:scale-95 transition-all duration-500 py-6 rounded-3xl text-xl font-medium flex items-center justify-center gap-4 disabled:bg-cloud disabled:text-charcoal/20 disabled:cursor-not-allowed group shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Initialize Staff Profile</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>

      <p className="text-center text-charcoal/20 text-xs tracking-[0.2em] font-bold mt-12 uppercase italic">Success will trigger an automated onboarding email invitation.</p>
    </div>
  );
}
