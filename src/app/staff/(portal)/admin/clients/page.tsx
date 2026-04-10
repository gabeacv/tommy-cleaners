"use client";

import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
        try {
            const res = await fetch("/api/staff/data?type=clients");
            const data = await res.json();
            if (Array.isArray(data)) {
                setClients(data);
            }
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchClients();
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
          <h1 className="text-4xl font-cursive text-charcoal mb-2">Our Clients</h1>
          <p className="text-charcoal/40 text-sm italic">Managing relationships across Manhattan.</p>
        </div>
        <button className="bg-primary text-charcoal px-10 py-5 rounded-2xl flex items-center gap-3 hover:shadow-xl transition-all duration-300 font-medium active:scale-95 shadow-lg">
          <Plus size={20} />
          <span>Add New Client</span>
        </button>
      </header>

      {/* Filter/Search Bar */}
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 border border-charcoal/5">
          <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 w-5 h-5" />
              <input 
                  placeholder="Search by name, address or email..." 
                  className="w-full bg-cloud px-16 py-4 rounded-xl focus:outline-shadow focus:ring-1 focus:ring-primary transition-all duration-300 text-charcoal" 
              />
          </div>
          <div className="flex gap-4">
               <button className="flex items-center gap-3 bg-cloud px-8 py-4 rounded-xl text-charcoal/60 hover:text-charcoal transition-colors">
                  <Filter size={18} />
                  <span>Filter</span>
               </button>
          </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map((client) => (
              <div key={client.id} className="bg-white p-8 rounded-3xl shadow-lg border border-charcoal/5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group">
                  <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-cursive text-2xl group-hover:bg-primary group-hover:text-charcoal transition-colors duration-500">{client.first_name[0]}{client.last_name[0]}</div>
                      <span className={`px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest ${client.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{client.status}</span>
                  </div>

                  <h3 className="text-2xl font-cursive text-charcoal mb-1">{client.first_name} {client.last_name}</h3>
                  <p className="text-charcoal/40 text-xs tracking-widest uppercase mb-6">{client.frequency} • {client.cleaner}</p>

                  <div className="flex flex-col gap-4 text-sm text-charcoal/70 mb-8 border-t border-charcoal/5 pt-6">
                      <p className="flex items-center gap-3">
                          <span className="opacity-40">Add:</span> {client.address}
                      </p>
                      <p className="flex items-center gap-3">
                          <span className="opacity-40">Ema:</span> {client.email}
                      </p>
                  </div>

                  <button className="w-full py-4 text-xs tracking-[0.2em] font-bold uppercase text-charcoal/40 hover:text-primary transition-colors border-t border-charcoal/5 pt-6 flex justify-center items-center gap-2">
                      View Full Profile →
                  </button>
              </div>
          ))}
      </div>
    </div>
  );
}
