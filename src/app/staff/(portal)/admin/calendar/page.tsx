"use client";

import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface Appointment {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  notes: string;
  employee_id: string;
  clients: {
    first_name: string;
    last_name: string;
    address: string;
    phone: string;
    allergies: string;
    notes: string;
  };
}

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
}

export default function AdminCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetch("/api/staff/data?type=appointments")
      .then(r => r.json())
      .then((data: Appointment[]) => {
        if (!Array.isArray(data)) return;
        setEvents(data.map(appt => ({
          title: `${appt.clients.first_name} ${appt.clients.last_name}`,
          start: appt.scheduled_at,
          end: new Date(
            new Date(appt.scheduled_at).getTime() + appt.duration_minutes * 60000
          ).toISOString(),
        })));
      });
  }, []);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const api = calendarRef.current?.getApi();
      if (!api) return;
      api.changeView(mobile ? "timeGridDay" : "timeGridWeek");
      setCurrentTitle(api.view.title);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    api?.prev();
    setCurrentTitle(api?.view.title ?? "");
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    api?.next();
    setCurrentTitle(api?.view.title ?? "");
  };

  const handleToday = () => {
    const api = calendarRef.current?.getApi();
    api?.today();
    setCurrentTitle(api?.view.title ?? "");
  };

  const handleViewChange = (view: string) => {
    const api = calendarRef.current?.getApi();
    api?.changeView(view);
    setCurrentTitle(api?.view.title ?? "");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 mb-6">
        {/* Page title row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-cursive text-charcoal mb-2">Master Calendar</h1>
            <p className="text-charcoal/40 text-sm italic">
              Manage all appointments across Manhattan.
            </p>
          </div>
          <button
            onClick={() => {}}
            className="w-full md:w-auto bg-primary text-charcoal px-8 py-4 rounded-2xl
              flex items-center justify-center gap-2 hover:shadow-xl transition-all
              duration-300 font-medium active:scale-95"
          >
            <Plus size={20} />
            <span>New Appointment</span>
          </button>
        </div>

        {/* Calendar controls row */}
        <div className="flex items-center justify-between gap-4 bg-white px-6 py-4
          rounded-2xl shadow-sm border border-charcoal/5">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl hover:bg-cloud transition-colors text-charcoal/60
                hover:text-charcoal"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl hover:bg-cloud transition-colors text-charcoal/60
                hover:text-charcoal"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest
                hover:bg-cloud transition-colors text-charcoal/60 hover:text-charcoal"
            >
              Today
            </button>
          </div>

          <span className="text-sm font-medium text-charcoal text-center flex-1 truncate
            px-2">
            {currentTitle}
          </span>

          {!isMobile && (
            <div className="flex items-center gap-1">
              {["dayGridMonth", "timeGridWeek", "timeGridDay"].map((view) => (
                <button
                  key={view}
                  onClick={() => handleViewChange(view)}
                  className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest
                    transition-colors text-charcoal/40 hover:text-charcoal hover:bg-cloud"
                >
                  {view === "dayGridMonth" ? "Month" : view === "timeGridWeek" ? "Week" : "Day"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="calendar-card bg-white p-4 md:p-12 rounded-3xl shadow-2xl border border-charcoal/5">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
          headerToolbar={false}
          events={events}
          height={isMobile ? "calc(100vh - 200px)" : "auto"}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          eventContent={(eventInfo) => (
            <div className="bg-white/80 p-2 rounded-lg text-charcoal border-l-4 border-primary shadow-sm h-full truncate">
              <p className="font-bold text-xs">{eventInfo.timeText}</p>
              <p className="text-sm italic">{eventInfo.event.title}</p>
            </div>
          )}
          allDaySlot={false}
          firstDay={1}
          nowIndicator={true}
        />
      </div>
    </div>
  );
}
