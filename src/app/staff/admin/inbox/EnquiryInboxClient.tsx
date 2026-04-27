"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Building, ChevronDown, ChevronUp, Check, Archive, Clock } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";

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

export default function EnquiryInboxClient() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-cursive text-charcoal mb-2">Enquiries</h2>
          <p className="text-charcoal/50">Manage your incoming cleaning requests.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <Clock size={16} />
          {enquiries.filter(e => e.status === 'new').length} New Enquiries
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-charcoal/5">
        <div className="grid grid-cols-[1.5fr,1fr,1fr,1fr,auto] gap-4 px-8 py-6 bg-cloud/50 border-b border-charcoal/5 text-xs uppercase tracking-widest font-semibold text-charcoal/40">
          <div>Full Name</div>
          <div>Property</div>
          <div>Area</div>
          <div>Date Received</div>
          <div>Status</div>
        </div>

        <div className="divide-y divide-charcoal/5">
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="flex flex-col transition-all">
              <button 
                onClick={() => setExpandedId(expandedId === enquiry.id ? null : enquiry.id)}
                className={`grid grid-cols-[1.5fr,1fr,1fr,1fr,auto] gap-4 px-8 py-6 items-center text-left hover:bg-cloud/30 transition-colors ${enquiry.status === 'new' ? 'font-bold' : ''}`}
              >
                <div className="text-charcoal">{enquiry.first_name} {enquiry.last_name}</div>
                <div className="text-charcoal/60 text-sm">{enquiry.property_type}</div>
                <div className="text-charcoal/60 text-sm">{enquiry.area}</div>
                <div className="text-charcoal/40 text-sm">{format(new Date(enquiry.created_at), 'MMM d, yyyy')}</div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={enquiry.status} />
                  {expandedId === enquiry.id ? <ChevronUp size={16} className="text-charcoal/20" /> : <ChevronDown size={16} className="text-charcoal/20" />}
                </div>
              </button>

              <AnimatePresence>
                {expandedId === enquiry.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-cloud/10"
                  >
                    <div className="px-8 pb-10 pt-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="md:col-span-2 flex flex-col gap-8">
                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/30 mb-2 block">Message</label>
                          <div className="bg-white p-6 rounded-2xl border border-charcoal/5 text-charcoal leading-relaxed whitespace-pre-wrap italic">
                            &quot;{enquiry.message}&quot;
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                           <div className="flex items-center gap-3 text-sm text-charcoal/60">
                             <Mail size={16} className="text-primary" />
                             <a href={`mailto:${enquiry.email}`} className="hover:text-primary transition-colors">{enquiry.email}</a>
                           </div>
                           <div className="flex items-center gap-3 text-sm text-charcoal/60">
                             <Phone size={16} className="text-primary" />
                             <a href={`tel:${enquiry.phone}`} className="hover:text-primary transition-colors">{enquiry.phone}</a>
                           </div>
                           <div className="flex items-center gap-3 text-sm text-charcoal/60">
                             <MapPin size={16} className="text-primary" />
                             <span>{enquiry.area}</span>
                           </div>
                           <div className="flex items-center gap-3 text-sm text-charcoal/60">
                             <Building size={16} className="text-primary" />
                             <span>{enquiry.property_type}</span>
                           </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/30 mb-2 block">Actions</label>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => updateStatus(enquiry.id, 'reviewed')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${enquiry.status === 'reviewed' ? 'bg-neutral-800 text-white border-neutral-800' : 'bg-white text-charcoal/60 border-charcoal/10 hover:border-neutral-800 hover:text-neutral-800 shadow-sm hover:shadow-md'}`}
                          >
                            <Check size={18} />
                            <span className="font-medium text-sm">Mark as Reviewed</span>
                          </button>
                          <button 
                            onClick={() => updateStatus(enquiry.id, 'archived')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${enquiry.status === 'archived' ? 'bg-neutral-200 text-neutral-500 border-neutral-200 cursor-not-allowed' : 'bg-white text-charcoal/60 border-charcoal/10 hover:border-red-400 hover:text-red-600 shadow-sm hover:shadow-md'}`}
                            disabled={enquiry.status === 'archived'}
                          >
                            <Archive size={18} />
                            <span className="font-medium text-sm">Archive Enquiry</span>
                          </button>
                          <button 
                            onClick={() => updateStatus(enquiry.id, 'new')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all mt-4 ${enquiry.status === 'new' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600/60 border-blue-100 hover:bg-blue-50 shadow-sm'}`}
                          >
                             <Clock size={18} />
                             <span className="font-medium text-sm">Reset to New</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {enquiries.length === 0 && (
            <div className="p-24 text-center">
              <p className="text-charcoal/30 text-lg">No enquiries found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
