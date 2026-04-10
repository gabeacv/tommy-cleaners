"use client";

import { createClient } from "@/lib/supabase";
import { LogOut, Calendar, Users, Briefcase, User, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StaffSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (role !== 'admin') return;

    const fetchCount = async () => {
      const { count } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');
      
      setUnreadCount(count || 0);
    };

    fetchCount();

    const channel = supabase
      .channel('enquiries-count')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'enquiries' 
      }, () => {
        fetchCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/staff");
  };

  const isAdmin = role === 'admin';

  const menuItems = isAdmin ? [
    { label: "Calendar", icon: Calendar, href: "/staff/admin/calendar" },
    { label: "Inbox", icon: Mail, href: "/staff/admin/inbox", badge: unreadCount > 0 ? unreadCount : null },
    { label: "Clients", icon: Users, href: "/staff/admin/clients" },
    { label: "Employees", icon: Briefcase, href: "/staff/admin/employees" },
  ] : [
    { label: "My Calendar", icon: Calendar, href: "/staff/employee/calendar" },
    { label: "My Profile", icon: User, href: "/staff/employee/profile" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-charcoal/5 flex flex-col p-8 gap-12 shrink-0">
      <h1 className="text-2xl font-cursive text-charcoal">Tommy Cleaners Staff</h1>
      
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 font-medium ${pathname === item.href ? 'bg-primary text-charcoal shadow-md' : 'text-charcoal/40 hover:bg-cloud hover:text-charcoal'}`}
          >
            <div className="flex items-center gap-4">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge !== null && (
              <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-4 px-6 py-4 text-charcoal/40 hover:text-red-400 transition-colors font-medium border-t border-charcoal/5 pt-8"
      >
        <LogOut size={20} />
        <span>Log Out</span>
      </button>
    </aside>
  );
}
