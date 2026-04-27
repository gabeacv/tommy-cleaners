"use client";

import { Plus, Phone, MapPin, Mail, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/staff/data?type=employees")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setEmployees(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-cursive text-charcoal mb-2">Our Team</h1>
          <p className="text-charcoal/40 text-sm italic">The people behind the peace of mind.</p>
        </div>
        <Link href="/staff/admin/employees/new">
          <button className="bg-primary text-charcoal px-10 py-5 rounded-2xl flex items-center gap-3 hover:shadow-xl transition-all duration-300 font-medium active:scale-95 shadow-lg">
            <Plus size={20} />
            <span>Add New Employee</span>
          </button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {employees.map((empl) => (
              <div key={empl.id} className="bg-white p-12 rounded-3xl shadow-xl border border-charcoal/5 group hover:shadow-2xl transition-all duration-500">
                  <div className="flex justify-between items-start mb-12">
                       <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-cursive text-4xl group-hover:bg-primary group-hover:text-charcoal transition-colors duration-500">{empl.full_name?.[0] ?? '?'}</div>
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

                  <div className="flex items-center justify-end border-t border-charcoal/5 pt-8">
                       <button className="text-xs tracking-[0.2em] font-bold uppercase text-primary hover:text-charcoal transition-colors">Manage →</button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
