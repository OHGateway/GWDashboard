import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { API_BASE_URLS } from '@/config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { MOCK_DATA } from "@/config";

// 요일 헤더 인라인 스타일 적용
function styleDayHeader(arg) {
  const day = arg.date.getDay();
  arg.el.style.letterSpacing = '0.02em';
  arg.el.style.borderRadius = '0.5rem';
  arg.el.style.padding = '0.25rem 0.5rem';
  arg.el.style.fontWeight = '600';
  arg.el.style.fontSize = '1.125rem';
  arg.el.style.background = '#f1f5f9'; // slate-100
  arg.el.style.color = '#334155'; // slate-700 기본
  if (day === 0) arg.el.style.color = '#ef4444'; // red-500
  if (day === 6) arg.el.style.color = '#2563eb'; // blue-600
}

// Jira API에서 이슈를 가져오는 함수
async function fetchJiraIssues(token) {
  // TODO: 실제 Jira 토큰을 안전한 방식으로 제공해야 합니다. (예: 환경 변수)
  if (!token) {
    return MOCK_DATA.jiraTickets;
    throw new Error('Jira API 토큰이 필요합니다.');
  }

  const url = `${API_BASE_URLS.JIRA}/rest/api/2/search`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jql: 'project = GW AND duedate is not EMPTY ORDER BY duedate DESC', // 'GW' 프로젝트의 마감일 있는 이슈 조회
      fields: ['summary', 'status', 'description', 'STG Deploy', 'PRD Deploy','assignee', 'reporter'],
      startAt: 0,
      maxResults: 50,
    }),
  });
  if (!res.ok) throw new Error('Jira API 요청 실패');
  const data = await res.json();
  return data.issues; // 이슈 목록 반환
}

export default function JiraCalendar() {
  const [selected, setSelected] = useState(null);
  // TODO: 실제 Jira API 토큰으로 교체해야 합니다.
  const JIRA_API_TOKEN = null; // 예: process.env.REACT_APP_JIRA_TOKEN

  const { data: jiraTickets, isLoading, isError, error } = useQuery({
    queryKey: ['jiraIssues'],
    queryFn: () => fetchJiraIssues(JIRA_API_TOKEN),
  });

  // mock 데이터로 이벤트 생성
  const events = useMemo(() => {
    if (!jiraTickets) return [];
    return jiraTickets.map((t) => ({
      id: t.key,
      title: `${t.key} · ${t.fields.summary}`,
      start: t.fields.created, // 마감일 기준으로 캘린더에 표시
      extendedProps: {
        key: t.key,
        status: t.fields.status.name,
        description: t.fields.description,
        self: t.self,
      },
      allDay: true,
    }));
  }, [jiraTickets]);

  // FullCalendar event click handler
  const handleEventClick = (info) => {
    setSelected({
      key: info.event.extendedProps.key,
      title: info.event.title,
      status: info.event.extendedProps.status,
      description: info.event.extendedProps.description,
      start: info.event.start,
      self: info.event.extendedProps.self,
    });
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] py-8 px-2 bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="w-full max-w-5xl shadow-xl rounded-2xl bg-white/90 p-6 mb-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-2 text-slate-800 flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#2563eb" /><path d="M7.5 8.5h9m-9 3h6m-6 3h3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>
          GATEWAY Jira 캘린더
        </h2>
        <div className="bg-white rounded-xl shadow p-2 md:p-4">
          {isLoading && (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
              <span className="ml-2 text-slate-600">Jira 이슈를 불러오는 중...</span>
            </div>
          )}
          {isError && (
            <Alert variant="destructive">
              <AlertTitle>오류 발생</AlertTitle>
              <AlertDescription>
                Jira 이슈를 가져오는 데 실패했습니다: {error.message}
              </AlertDescription>
            </Alert>
          )}
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            locale="ko"
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next'
            }}
            footerToolbar={{
              left: '',
              center: '',
              right: 'today dayGridMonth,dayGridWeek,dayGridDay'
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.7}
            expandRows={true}
            dayMaxEventRows={3}
            eventDisplay="block"
            dayHeaderClassNames={[]}
            eventBackgroundColor="#2563eb"
            eventBorderColor="#2563eb"
            dayHeaderDidMount={styleDayHeader}
          />
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div><span className="font-semibold">이슈 키:</span> {selected?.key}</div>
            <div><span className="font-semibold">상태:</span> <span className={
              selected?.status === 'Done' ? 'text-green-600' : selected?.status === 'In Progress' ? 'text-yellow-600' : 'text-red-600'
            }>{selected?.status}</span></div>
            <div><span className="font-semibold">마감일:</span> {selected ? format(selected.start, 'yyyy-MM-dd') : ''}</div>
            <div className="pt-1">
              <p className="font-semibold mb-1">상세 설명:</p>
              <p className="p-2 bg-slate-50 rounded border">{selected?.description || '설명이 없습니다.'}</p>
            </div>
            {selected?.self && (
              <div>
                <span className="font-semibold">이슈 링크:</span>
                <a href={selected.self} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline"> {selected.self}</a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
