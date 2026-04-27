"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Archive, 
  Clock, 
  Loader2, 
  Search,
  Inbox as InboxIcon,
  Filter
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";

type EnquiryStatus = 'new' | 'reviewed' | 'archived';

interface Enquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_type: string;
  area: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

const TABS: { id: EnquiryStatus; label: string; icon: any }[] = [
  { id: 'new', label: 'New', icon: Mail },
  { id: 'reviewed', label: 'Reviewed', icon: Check },
  { id: 'archived', label: 'Archived', icon: Archive },
];

export default function EnquiryInboxClient() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EnquiryStatus>('new');
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/staff/admin/inbox');
      if (!res.ok) throw new Error('Failed to fetch enquiries');
      const data = await res.json();
      setEnquiries(data);
    } catch {
      setError('Could not load enquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('enquiries-inbox')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'enquiries' 
      }, () => {
        fetchEnquiries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const updateStatus = async (id: string, newStatus: EnquiryStatus) => {
    // Optimistic update
    const previousEnquiries = [...enquiries];
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));

    try {
      const res = await fetch(`/api/staff/admin/inbox/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Update failed');
    } catch {
      // Revert on error
      setEnquiries(previousEnquiries);
      alert('Failed to update status. Please try again.');
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries
      .filter(e => e.status === activeTab)
      .filter(e => {
        const search = searchQuery.toLowerCase();
        return (
          e.first_name.toLowerCase().includes(search) ||
          e.last_name.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search) ||
          e.message.toLowerCase().includes(search) ||
          e.area.toLowerCase().includes(search)
        );
      });
  }, [enquiries, activeTab, searchQuery]);

  const counts = useMemo(() => ({
    new: enquiries.filter(e => e.status === 'new').length,
    reviewed: enquiries.filter(e => e.status === 'reviewed').length,
    archived: enquiries.filter(e => e.status === 'archived').length,
  }), [enquiries]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-charcoal/40 font-medium animate-pulse">Loading enquiries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 flex flex-col items-center gap-4">
        <p className="font-medium text-lg text-center">{error}</p>
        <button 
          onClick={fetchEnquiries}
          className="bg-white px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-cursive text-charcoal mb-2">Inbox</h2>
          <p className="text-charcoal/50">Manage your incoming cleaning requests and enquiries.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={18} />
          <input 
            type="text" 
            placeholder="Search enquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-charcoal/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-cloud/50 rounded-2xl border border-charcoal/5 self-start">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/40 hover:text-charcoal/60'}`}
          >
            <tab.icon size={16} />
            {tab.label}
            {counts[tab.id] > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-primary/20 text-charcoal' : 'bg-charcoal/5 text-charcoal/40'}`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-charcoal/5">

        <div className="divide-y divide-charcoal/5">
          {filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="flex flex-col transition-all">
              <AnimatePresence>
                {expandedId === enquiry.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-cloud/10"
                  >
                    <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-charcoal/5">
                      <div className="md:col-span-2 flex flex-col gap-8">
                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/30 mb-2 block">Message</label>
                          <div className="bg-white p-6 rounded-2xl border border-charcoal/5 text-charcoal leading-relaxed whitespace-pre-wrap italic shadow-sm">
                            &quot;{enquiry.message}&quot;
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="flex items-center gap-2 text-sm text-charcoal/60">
                             <Mail size={14} className="text-primary" />
                             <a href={`mailto:${enquiry.email}`} className="hover:text-primary transition-colors font-medium">{enquiry.email}</a>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-charcoal/60">
                             <Phone size={14} className="text-primary" />
                             <a href={`tel:${enquiry.phone}`} className="hover:text-primary transition-colors font-medium">{enquiry.phone}</a>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-charcoal/60">
                             <MapPin size={14} className="text-primary" />
                             <span className="font-medium">{enquiry.area}</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-charcoal/60">
                             <Building size={14} className="text-primary" />
                             <span className="font-medium">{enquiry.property_type}</span>
                           </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/30 mb-2 block">Status Actions</label>
                        <div className="flex flex-col gap-2">
                          {enquiry.status !== 'reviewed' && (
                            <button 
                              onClick={() => updateStatus(enquiry.id, 'reviewed')}
                              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-neutral-800 text-white hover:bg-black transition-all shadow-md group"
                            >
                              <Check size={18} className="group-hover:scale-110 transition-transform" />
                              <span className="font-semibold text-sm">Mark as Reviewed</span>
                            </button>
                          )}
                          
                          {enquiry.status !== 'archived' && (
                            <button 
                              onClick={() => updateStatus(enquiry.id, 'archived')}
                              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-charcoal/60 border border-charcoal/10 hover:border-red-400 hover:text-red-600 transition-all shadow-sm group"
                            >
                              <Archive size={18} className="group-hover:scale-110 transition-transform" />
                              <span className="font-semibold text-sm">Archive Enquiry</span>
                            </button>
                          )}

                          {(enquiry.status === 'reviewed' || enquiry.status === 'archived') && (
                            <button 
                              onClick={() => updateStatus(enquiry.id, 'new')}
                              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-primary border border-primary/20 hover:bg-primary/5 transition-all shadow-sm group mt-2"
                            >
                               <Clock size={18} className="group-hover:scale-110 transition-transform" />
                               <span className="font-semibold text-sm">Reset to New</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setExpandedId(expandedId === enquiry.id ? null : enquiry.id)}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-4 w-full text-left hover:bg-cloud/30 transition-colors"
              >
                <div className="font-medium text-ocean min-w-[140px]">
                  {enquiry.first_name} {enquiry.last_name}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>{enquiry.property_type}</span>
                  <span>·</span>
                  <span>{enquiry.area}</span>
                  <span>·</span>
                  <span>{format(new Date(enquiry.created_at), 'MMM d, yyyy')}</span>
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <StatusBadge status={enquiry.status} />
                  {expandedId === enquiry.id ? <ChevronUp size={16} className="text-charcoal/20" /> : <ChevronDown size={16} className="text-charcoal/20" />}
                </div>
              </button>
            </div>
          ))}

          {filteredEnquiries.length === 0 && (
            <div className="p-32 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-cloud flex items-center justify-center text-charcoal/20 mb-2">
                <InboxIcon size={32} />
              </div>
              <p className="text-charcoal/40 text-lg font-medium">No {activeTab} enquiries found.</p>
              {searchQuery && (
                <p className="text-charcoal/30 text-sm">Try adjusting your search query.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
