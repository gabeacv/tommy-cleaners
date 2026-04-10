"use client";

import StaffLayout from "@/components/StaffLayout";
import { Plus, User, Phone, MapPin, Mail, Clock } from "lucide-react";

const mockEmployees = [
    { id: 1, full_name: 'Tommy Nelson', role: 'admin', email: 'tommy@tommycleaners.com', phone: '+1 (555) 902-1234', address: 'Upper West Side, NY', constraintsCount: 2 },
    { id: 2, full_name: 'Sarah Jenkins', role: 'employee', email: 'sarah@tommycleaners.com', phone: '+1 (555) 123-4567', address: 'Brooklyn Heights, NY', constraintsCount: 1 },
];

export default function AdminEmployees() {
  return (
    <StaffLayout>
      <div className="flex flex-col gap-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-cursive text-charcoal mb-2">Our Team</h1>
            <p className="text-charcoal/40 text-sm italic">The people behind the peace of mind.</p>
          </div>
          <button className="bg-primary text-charcoal px-10 py-5 rounded-2xl flex items-center gap-3 hover:shadow-xl transition-all duration-300 font-medium active:scale-95 shadow-lg">
            <Plus size={20} />
            <span>Add New Employee</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockEmployees.map((empl) => (
                <div key={empl.id} className="bg-white p-12 rounded-3xl shadow-xl border border-charcoal/5 group hover:shadow-2xl transition-all duration-500">
                    <div className="flex justify-between items-start mb-12">
                         <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-cursive text-4xl group-hover:bg-primary group-hover:text-charcoal transition-colors duration-500">{empl.full_name[0]}</div>
                         <span className="px-6 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] bg-charcoal text-white">{empl.role}</span>
                    </div>

                    <h3 className="text-3xl font-cursive text-charcoal mb-8">{empl.full_name}</h3>

                    <div className="flex flex-col gap-6 text-sm text-charcoal/70 mb-12 border-t border-charcoal/5 pt-8 font-light">
                        <p className="flex items-center gap-4">
                            <Mail size={16} className="text-primary" /> {empl.email}
                        </p>
                        <p className="flex items-center gap-4">
                            <Phone size={16} className="text-primary" /> {empl.phone}
                        </p>
                        <p className="flex items-center gap-4">
                            <MapPin size={16} className="text-primary" /> {empl.address}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-charcoal/5 pt-8">
                         <div className="flex items-center gap-3 text-charcoal/40 text-xs tracking-widest uppercase">
                            <Clock size={16} />
                            <span>{empl.constraintsCount} Availability Constraints</span>
                         </div>
                         <button className="text-xs tracking-[0.2em] font-bold uppercase text-primary hover:text-charcoal transition-colors">Manage →</button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </StaffLayout>
  );
}
