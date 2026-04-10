"use client";

import StaffLayout from "@/components/StaffLayout";
import { Plus, Trash, User, Phone, MapPin, Mail, Clock } from "lucide-react";
import { useState } from "react";

const mockConstraints = [
    { id: 1, day: 'Monday', start: '08:00 AM', end: '09:00 AM', label: 'School Run' },
    { id: 2, day: 'Wednesday', start: '04:00 PM', end: '06:00 PM', label: 'External Class' },
];

export default function EmployeeProfile() {
  const [info, setInfo] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah@tommycleaners.com',
    phone: '+1 (555) 123-4567',
    address: 'Brooklyn Heights, NY',
    role: 'employee',
  });
  const [constraints, setConstraints] = useState(mockConstraints);

  return (
    <StaffLayout>
      <div className="flex flex-col gap-16 pb-24">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-cursive text-charcoal mb-2">My Profile</h1>
            <p className="text-charcoal/40 text-sm italic">Manage your information and availability constraints.</p>
          </div>
          <button className="bg-charcoal text-white px-10 py-5 rounded-2xl flex items-center gap-3 hover:shadow-xl transition-all duration-300 font-medium active:scale-95 shadow-lg">
            <span>Update Information</span>
          </button>
        </header>

        {/* Basic Info */}
        <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-charcoal/5 grid grid-cols-1 md:grid-cols-2 gap-12 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-1000">
                <User size={200} />
             </div>

             <div className="flex flex-col gap-8">
                 <h3 className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 border-b border-charcoal/5 pb-4">Personal Details</h3>
                 <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-3">
                         <label className="text-xs font-bold text-primary tracking-widest uppercase">Full Name</label>
                         <p className="text-2xl font-cursive text-charcoal">{info.name}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                         <label className="text-xs font-bold text-primary tracking-widest uppercase">Email Address</label>
                         <p className="text-2xl font-cursive text-charcoal italic">{info.email}</p>
                    </div>
                 </div>
             </div>

             <div className="flex flex-col gap-8">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 border-b border-charcoal/5 pb-4">Contact & Location</h3>
                 <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-3">
                         <label className="text-xs font-bold text-primary tracking-widest uppercase">Phone Number</label>
                         <p className="text-2xl font-cursive text-charcoal">{info.phone}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                         <label className="text-xs font-bold text-primary tracking-widest uppercase">Office Coverage</label>
                         <p className="text-2xl font-cursive text-charcoal italic">{info.address}</p>
                    </div>
                 </div>
             </div>
        </div>

        {/* Availability Constraints */}
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center px-4">
                 <h3 className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 border-b border-charcoal/5 pb-4 w-full">Permanent Availability Constraints</h3>
                 <button className="bg-primary/20 text-primary p-4 rounded-full hover:bg-primary hover:text-charcoal transition-all duration-300 ml-8 -mt-2">
                    <Plus size={24} />
                 </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {constraints.map((c) => (
                    <div key={c.id} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-charcoal/5 flex flex-col gap-6 group hover:translate-y-[-4px] transition-transform duration-300">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3 bg-red-50 px-6 py-2 rounded-full text-red-400 text-[10px] uppercase font-bold tracking-widest">
                                <Clock size={12} />
                                <span>{c.day}</span>
                            </div>
                            <button className="text-charcoal/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 duration-300">
                                <Trash size={18} />
                            </button>
                        </div>

                        <h4 className="text-3xl font-cursive text-charcoal mb-2">{c.label}</h4>
                        <p className="text-charcoal/40 text-sm tracking-widest flex items-center gap-2">
                            <span>{c.start}</span>
                            <span className="opacity-20">—</span>
                            <span>{c.end}</span>
                        </p>
                    </div>
                ))}

                <button className="border-2 border-dashed border-charcoal/10 p-12 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:border-primary transition-colors cursor-pointer">
                    <Plus className="text-charcoal/20 group-hover:text-primary transition-colors duration-500" size={40} />
                    <p className="text-xs uppercase tracking-widest font-bold text-charcoal/20 group-hover:text-primary transition-colors duration-500">Define New Constraint</p>
                </button>
            </div>
            
            <p className="px-8 py-4 bg-cloud text-charcoal/30 text-[10px] uppercase tracking-[0.25em] font-bold rounded-2xl text-center mt-12 italic">Constraints enable admin to avoid scheduling conflicts during automated assignments.</p>
        </div>
      </div>
    </StaffLayout>
  );
}
