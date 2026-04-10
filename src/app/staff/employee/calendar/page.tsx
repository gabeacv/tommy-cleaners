"use client";

import StaffLayout from "@/components/StaffLayout";
import { Clock, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";

const mockAppointments = [
    { 
        id: 1, 
        client: 'Emma Watson', 
        time: '10:00 AM — 02:00 PM', 
        address: '123 Upper East Side, NY', 
        phone: '+1 (555) 902-1234', 
        allergies: 'Peanuts (Sever), Latex',
        notes: 'Enjoys a clean and quiet house. Please arrive through the side entrance.' 
    },
    { 
        id: 2, 
        client: 'John Doe', 
        time: '03:00 PM — 07:00 PM', 
        address: '456 Wall St, NY', 
        phone: '+1 (555) 123-4567', 
        allergies: 'None',
        notes: 'Corporate office. Focus on the main conference room and reception.' 
    },
];

export default function EmployeeCalendar() {
  const [selectedAppt, setSelectedAppt] = useState<typeof mockAppointments[0] | null>(null);

  return (
    <StaffLayout>
      <div className="flex flex-col gap-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-cursive text-charcoal mb-2">My Service Schedule</h1>
            <p className="text-charcoal/40 text-sm italic">Restore peace of mind to your assigned clients.</p>
          </div>
          <div className="bg-primary/20 px-8 py-4 rounded-full text-primary font-cursive text-lg">Today, April 12th</div>
        </header>

        <div className="flex flex-col gap-6">
            {mockAppointments.map((appt) => (
                <div 
                    key={appt.id} 
                    onClick={() => setSelectedAppt(appt)} 
                    className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-charcoal/5 flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-500"
                >
                    <div className="flex items-center gap-8 w-full md:w-auto">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-cursive text-3xl group-hover:bg-primary group-hover:text-charcoal transition-colors duration-500 shrink-0">{appt.client[0]}</div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-2xl font-cursive text-charcoal">{appt.client}</h3>
                            <div className="flex items-center gap-3 text-charcoal/40 text-xs tracking-widest uppercase mt-2">
                                <Clock size={16} />
                                <span>{appt.time}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                        <p className="text-sm italic font-light text-charcoal/60 hidden md:block">Click for details</p>
                        <button className="bg-cloud text-charcoal/40 p-4 rounded-full group-hover:text-primary transition-colors hover:bg-primary/20">
                             <User size={24} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[10px] p-6 flex items-center justify-center animate-in fade-in zoom-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 relative flex flex-col gap-10">
                 <button 
                    onClick={() => setSelectedAppt(null)}
                    className="absolute top-8 right-8 text-charcoal/20 hover:text-charcoal transition-colors text-6xl font-light hover:rotate-90 transition-transform duration-300"
                 >
                    ×
                 </button>

                 <div className="flex items-center gap-8">
                     <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-cursive text-4xl">{selectedAppt.client[0]}</div>
                     <div className="flex flex-col gap-2">
                         <h2 className="text-5xl font-cursive text-charcoal">{selectedAppt.client}</h2>
                         <p className="text-charcoal/40 text-xs tracking-widest uppercase">{selectedAppt.time}</p>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-y border-charcoal/5 py-10">
                     <div className="flex flex-col gap-3">
                         <h4 className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-charcoal/40 mb-2">
                            <MapPin size={14} /> <span>Address</span>
                         </h4>
                         <p className="text-xl italic font-cursive text-charcoal">{selectedAppt.address}</p>
                     </div>
                     <div className="flex flex-col gap-3">
                         <h4 className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-charcoal/40 mb-2">
                            <Phone size={14} /> <span>Phone Number</span>
                         </h4>
                         <p className="text-xl italic font-cursive text-charcoal">{selectedAppt.phone}</p>
                     </div>
                 </div>

                 <div className="flex flex-col gap-4">
                     <h4 className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 mb-2">Important Details</h4>
                     <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col gap-2">
                        <p className="text-xs uppercase font-bold text-red-400 tracking-widest">⚠️ Allergies</p>
                        <p className="text-red-900 font-medium">{selectedAppt.allergies}</p>
                     </div>
                     <div className="bg-cloud p-8 rounded-3xl border border-charcoal/5 flex flex-col gap-2 relative">
                        <p className="text-xs uppercase font-bold text-charcoal/20 tracking-widest">Special Notes</p>
                        <p className="text-charcoal italic leading-relaxed font-light">{selectedAppt.notes}</p>
                     </div>
                 </div>

                 <button 
                    onClick={() => setSelectedAppt(null)}
                    className="w-full bg-primary text-charcoal py-6 rounded-3xl text-xl font-medium hover:shadow-2xl active:scale-95 transition-all duration-300 mt-6"
                 >
                    Acknowledge & Close
                 </button>
             </div>
        </div>
      )}
    </StaffLayout>
  );
}
