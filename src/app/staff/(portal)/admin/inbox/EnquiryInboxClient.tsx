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
  Filter,
  RotateCcw
} from "lucide-react";
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

  // Auto-scroll when expanding
  useEffect(() => {
    if (expandedId) {
      const element = document.getElementById(`enquiry-${expandedId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [expandedId]);

  // Click away to close
  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      if (expandedId && !(e.target as HTMLElement).closest('.enquiry-item')) {
        setExpandedId(null);
      }
    };
    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, [expandedId]);

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-cursive text-charcoal">Inbox</h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={14} />
          <input 
            type="text" 
            placeholder="Search enquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-charcoal/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 w-full p-1 bg-cloud/50 rounded-xl border border-charcoal/5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all font-medium text-xs min-w-0 ${
              activeTab === tab.id
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-charcoal/40 hover:text-charcoal/60'
            }`}
          >
            <tab.icon size={12} className="shrink-0" />
            <span className="truncate">{tab.label}</span>
            {counts[tab.id] > 0 && (
              <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-primary/20 text-charcoal' : 'bg-charcoal/5 text-charcoal/40'
              }`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-charcoal/5">

        <div className="divide-y divide-charcoal/5">
          {filteredEnquiries.map((enquiry) => (
            <div 
              key={enquiry.id} 
              id={`enquiry-${enquiry.id}`}
              className="enquiry-item flex flex-col transition-all"
            >
              <AnimatePresence>
                {expandedId === enquiry.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-cloud/10"
                  >
                    <div 
                      onClick={() => setExpandedId(null)}
                      className="px-8 pb-10 pt-4 border-t border-charcoal/5 cursor-pointer"
                    >
                      {/* Message */}
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-charcoal/80 leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1 mb-6 cursor-text"
                      >
                        "{enquiry.message}"
                      </div>

                      {/* Contact row */}
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-xs text-charcoal/60 cursor-default"
                      >
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-primary/50" />
                          <span className="font-medium text-charcoal/80 selection:bg-primary/10">{enquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-primary/50" />
                          <span className="font-medium text-charcoal/80 selection:bg-primary/10">{enquiry.phone}</span>
                        </div>
                        <div className="px-2 py-0.5 rounded bg-charcoal/5 uppercase tracking-wider font-semibold text-[10px]">{enquiry.area}</div>
                        <div className="px-2 py-0.5 rounded bg-charcoal/5 uppercase tracking-wider font-semibold text-[10px]">{enquiry.property_type}</div>
                      </div>

                      {/* Action row */}
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 pt-4 border-t border-charcoal/5"
                      >
                        {enquiry.status !== 'reviewed' && (
                          <button 
                            onClick={() => updateStatus(enquiry.id, 'reviewed')}
                            title="Mark as Reviewed"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-medium hover:bg-black transition-colors"
                          >
                            <Check size={14} />
                            <span>Reviewed</span>
                          </button>
                        )}
                        {enquiry.status !== 'archived' && (
                          <button 
                            onClick={() => updateStatus(enquiry.id, 'archived')}
                            title="Archive"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-charcoal/10 text-charcoal/50 text-xs font-medium hover:border-red-300 hover:text-red-500 transition-colors"
                          >
                            <Archive size={14} />
                            <span>Archive</span>
                          </button>
                        )}
                        {(enquiry.status === 'reviewed' || enquiry.status === 'archived') && (
                          <button 
                            onClick={() => updateStatus(enquiry.id, 'new')}
                            title="Reset to New"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 text-primary text-xs font-medium hover:bg-primary/5 transition-colors"
                          >
                            <RotateCcw size={14} />
                            <span>Reset</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setExpandedId(expandedId === enquiry.id ? null : enquiry.id)}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-3 w-full text-left hover:bg-cloud/30 transition-colors"
              >
                <div className={`flex items-center gap-2 min-w-[160px] ${enquiry.status === 'new' ? 'font-bold text-ocean' : 'font-medium text-charcoal/70'}`}>
                  {enquiry.status === 'new' && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />}
                  {enquiry.first_name} {enquiry.last_name}
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal/40">
                  <span>{enquiry.property_type}</span>
                  <span className="opacity-30">·</span>
                  <span>{enquiry.area}</span>
                  <span className="opacity-30">·</span>
                  <span>{format(new Date(enquiry.created_at), 'MMM d')}</span>
                </div>
                <div className="ml-auto flex items-center gap-4">
                  {expandedId === enquiry.id ? <ChevronUp size={14} className="text-charcoal/20" /> : <ChevronDown size={14} className="text-charcoal/20" />}
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
