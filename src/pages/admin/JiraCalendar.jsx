// 요일 헤더 커스텀 렌더러 (JSX)
function renderDayHeader(arg) {
  const day = arg.date.getDay();
  let color = 'text-slate-700';
  if (day === 0) color = 'text-red-500 font-bold';
  if (day === 6) color = 'text-blue-600 font-bold';
  return (
    <div className={`rounded-lg px-2 py-1 text-base md:text-lg font-semibold bg-slate-100 ${color}`} style={{ letterSpacing: '0.02em' }}>
      {arg.text}
    </div>
  );
}
import { useMemo, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MOCK_DATA } from "@/config";
import { createElement } from "react";



export default function JiraCalendar() {
  const [selected, setSelected] = useState(null);

  // mock 데이터로 이벤트 생성
  const events = useMemo(() =>
    MOCK_DATA.jiraTickets.map((t) => ({
      id: t.id,
      title: `${t.id} · ${t.title}`,
      start: t.duedate, // FullCalendar는 start로 인식
      extendedProps: {
        status: t.status,
        description: t.description,
      },
      allDay: true,
      backgroundColor: '#2563eb',
      borderColor: '#2563eb',
      textColor: '#fff',
    })),
    []
  );

  // FullCalendar event click handler
  const handleEventClick = (info) => {
    setSelected({
      title: info.event.title,
      status: info.event.extendedProps.status,
      description: info.event.extendedProps.description,
      start: info.event.start,
    });
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] py-8 px-2 bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="w-full max-w-5xl shadow-xl rounded-2xl bg-white/90 p-6 mb-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-2 text-slate-800 flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#2563eb"/><path d="M7.5 8.5h9m-9 3h6m-6 3h3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Jira 이슈 캘린더
        </h2>
        <p className="text-slate-500 mb-4">Gateway 일정을 확인하세요.</p>
        <div className="bg-white rounded-xl shadow p-2 md:p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            locale="ko"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            }}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.7}
            expandRows={true}
            dayMaxEventRows={3}
            eventDisplay="block"
            dayHeaderContent={renderDayHeader}
          />
        </div>

      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div><span className="font-semibold">상태:</span> <span className={
              selected?.status === 'Done' ? 'text-green-600' : selected?.status === 'In Progress' ? 'text-yellow-600' : 'text-red-600'
            }>{selected?.status}</span></div>
            <div><span className="font-semibold">설명:</span> {selected?.description}</div>
            <div><span className="font-semibold">날짜:</span> {selected ? format(selected.start, 'yyyy-MM-dd') : ''}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}