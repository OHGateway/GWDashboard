import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MOCK_DATA } from "@/config";

const locales = {} as any;
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });

type TicketEvent = Event & { id: string; status: string; description: string };

export default function JiraCalendar() {
  const [queries, setQueries] = useState<string[]>(["assignee = currentUser()", "reporter = 'John Doe'"]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<TicketEvent | null>(null);

  const events = useMemo<TicketEvent[]>(() => {
    return MOCK_DATA.jiraTickets.map((t) => ({
      id: t.id,
      title: `${t.id} · ${t.title}`,
      start: new Date(t.duedate),
      end: new Date(t.duedate),
      allDay: true,
      status: t.status,
      description: t.description,
    }));
  }, []);

  const add = () => { if (!q) return; setQueries((prev) => [q, ...prev]); setQ(""); };
  const remove = (idx: number) => setQueries((prev) => prev.filter((_, i) => i !== idx));

  return (
    <>
      <Helmet>
        <title>관리자 Jira 캘린더</title>
        <meta name="description" content="JQL을 추가하고 티켓 일정을 캘린더로 확인하세요." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <div className="grid gap-4">
        <Card>
          <CardHeader><CardTitle>JQL 관리</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-3">
            <Input placeholder="예: assignee = currentUser()" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button onClick={add}>추가</Button>
            <div className="col-span-1 md:col-span-1" />
            <div className="md:col-span-3">
              <ul className="list-disc pl-5 space-y-1">
                {queries.map((qq, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{qq}</span>
                    <Button size="sm" variant="outline" onClick={() => remove(i)}>삭제</Button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>캘린더</CardTitle></CardHeader>
          <CardContent>
            <div className="bg-card p-2 rounded-md">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectEvent={(e) => setSelected(e as TicketEvent)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div><strong>상태:</strong> {selected?.status}</div>
            <div><strong>설명:</strong> {selected?.description}</div>
            <div><strong>날짜:</strong> {selected ? format(selected.start as Date, 'yyyy-MM-dd') : ''}</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
