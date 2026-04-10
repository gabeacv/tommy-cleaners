"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus } from "lucide-react";

export default function AdminCalendar() {
  const [events, setEvents] = useState([
    { title: 'Emma Watson', start: '2026-04-12T10:00:00', end: '2026-04-12T14:00:00' },
    { title: 'John Doe', start: '2026-04-13T09:00:00', end: '2026-04-13T13:00:00' },
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-cursive text-charcoal mb-2">Master Calendar</h1>
          <p className="text-charcoal/40 text-sm italic">Manage all appointments across Manhattan.</p>
        </div>
        <button className="bg-primary text-charcoal px-8 py-4 rounded-2xl flex items-center gap-2 hover:shadow-xl transition-all duration-300 font-medium active:scale-95">
          <Plus size={20} />
          <span>New Appointment</span>
        </button>
      </header>

      <div className="calendar-card bg-white p-12 rounded-3xl shadow-2xl border border-charcoal/5">
           <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={events}
              height="auto"
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

      {/* Global styles for FullCalendar theming */}
      <style jsx global>{`
          .fc {
              font-family: 'Inter', sans-serif !important;
              --fc-border-color: rgba(44, 44, 44, 0.05);
              --fc-today-bg-color: rgba(191, 217, 242, 0.1);
              --fc-button-bg-color: #2C2C2C;
              --fc-button-border-color: #2C2C2C;
              --fc-button-hover-bg-color: #bfd9f2;
              --fc-button-hover-border-color: #bfd9f2;
              --fc-button-active-bg-color: #bfd9f2;
              --fc-button-active-border-color: #bfd9f2;
          }
          .fc-col-header-cell-cushion { color: #2C2C2C !important; text-transform: uppercase; font-size: 10px; font-weight: bold; padding: 10px !important; }
          .fc-button-primary:disabled { background-color: #ccc !important; border-color: #ccc !important; }
          .fc-button-primary:not(:disabled):active { color: #2C2C2C !important; }
      `}</style>
    </div>
  );
}
