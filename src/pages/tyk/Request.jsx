import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ASSIGNEES } from "@/mocks/assignees";


export default function TykRequest() {
  const [open, setOpen] = useState(false);

  const [newAssignee, setNewAssignee] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const [editAssignee, setEditAssignee] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const [etcAssignee, setEtcAssignee] = useState("");
  const [etcDueDate, setEtcDueDate] = useState("");

  const [editMode, setEditMode] = useState("path");
  const [editPathOld, setEditPathOld] = useState("");
  const [editPathNew, setEditPathNew] = useState("");
  const [editPathReason, setEditPathReason] = useState("");
  const [editTargetOld, setEditTargetOld] = useState("");
  const [editTargetNew, setEditTargetNew] = useState("");
  const [editTargetReason, setEditTargetReason] = useState("");

  // const submit = (e) => {
  //   e.preventDefault();
  //   // 여기서 폼 데이터 수집/전송 로직을 넣을 수 있습니다.
  //   // 예시: console.log({ type: activeTab, payload: {...} })
  //   setOpen(true);
  // };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // 폼의 name 속성이 없는 기존 입력들을 안전하게 읽어오는 폴백
    const fd = new FormData(form);
    const apiName = (fd.get('apiName') || form.querySelector('input[placeholder^="API 이름"]')?.value || '').toString();
    const listenPath = (fd.get('listenPath') || form.querySelector('input[placeholder*="Listen Path"]')?.value || '').toString();
    const targetUrl = (fd.get('targetUrl') || form.querySelector('input[placeholder*="Target URL"]')?.value || '').toString();
    const etcMessage = (fd.get('etcMessage') || form.querySelector('textarea[placeholder*="문의 내용"]')?.value || '').toString();
    const reporter = (fd.get('reporter') || form.querySelector('input[placeholder*="요청자"]')?.value || '').toString();

    const jira_api_base = import.meta.env.VITE_JIRA_API_BASE;

    const payload = {
      fields:{
        project: { key: "CCSGATEWAY" },
      },
      issuetype: {
        name: "API GW",
      },
      assignee: {
        name: newAssignee || editAssignee || etcAssignee,
      },
      reporter: {
        name: reporter,
      },
      description: {
        apiName: apiName,
        listenPath: listenPath,
        targetUrl: targetUrl,
        dueDate: newDueDate,
        assignee: newAssignee,
      },
      meta: { submittedAt: new Date().toISOString() },
    };

    try {
      const res = await fetch(`${jira_api_base}/rest/api/2/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || `서버 오류: ${res.status}`);
      }

      // 성공 처리: 모달 오픈 또는 상태 업데이트
      setOpen(true);
    } catch (err) {
      // console.error('submit error', err);
      setOpen(true);
      // alert('전송 중 오류가 발생했습니다: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  return (
    <>
      <Helmet>
        <title>TYK 업무 요청</title>
        <meta name="description" content="신규 등록, 수정 요청, 기타 문의를 접수하세요." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">신규 등록</TabsTrigger>
          <TabsTrigger value="edit">수정 요청</TabsTrigger>
          <TabsTrigger value="etc">기타 문의</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <Card>
            <CardHeader><CardTitle>Listen Path 신규 등록</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-3 max-w-xl">
                <Input name="apiName" placeholder="API 이름" required />
                <Input name="listenPath" placeholder="Listen Path (예: /order-service/)" required />
                <Input name="targetUrl" placeholder="Target URL (예: https://orders.example.com)" required />
                <Input name="reporter" placeholder="요청자의 사번을 입력해주세요" required />

                <div>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    aria-label="Assignee 선택"
                    required
                  >
                    <option value="" disabled>담당자를 선택하세요</option>
                    {ASSIGNEES.filter(a => a.id !== "").map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm mb-1 block">Due Date</label>
                  <Input
                    id="due-date"
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    aria-label="Due Date"
                    required
                  />
                </div>

                <Button type="submit" variant="default">요청 제출</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="edit">
          <Card>
            <CardHeader><CardTitle>수정 요청</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-3 max-w-xl">
                <div>
                  <label className="text-sm mb-1 block">수정 종류</label>
                  <select
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    aria-label="수정 종류 선택"
                  >
                    <option value="path">Listen Path 수정</option>
                    <option value="target">Target Host 수정</option>
                  </select>
                </div>

                {editMode === "path" ? (
                  <>
                    <Input
                      placeholder="기존 Listen Path (예: /order-service/)"
                      value={editPathOld}
                      onChange={(e) => setEditPathOld(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="변경할 Listen Path (예: /new-order-service/)"
                      value={editPathNew}
                      onChange={(e) => setEditPathNew(e.target.value)}
                      required
                    />
                    <Textarea
                      placeholder="변경 사유"
                      value={editPathReason}
                      onChange={(e) => setEditPathReason(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="기존 Target Host (예: https://old.example.com)"
                      value={editTargetOld}
                      onChange={(e) => setEditTargetOld(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="변경할 Target Host (예: https://new.example.com)"
                      value={editTargetNew}
                      onChange={(e) => setEditTargetNew(e.target.value)}
                      required
                    />
                    <Textarea
                      placeholder="변경 사유"
                      value={editTargetReason}
                      onChange={(e) => setEditTargetReason(e.target.value)}
                    />
                  </>
                )}

                <Input name="reporter" placeholder="요청자의 사번을 입력해주세요" required />

                <div>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    aria-label="Assignee 선택"
                    required
                  >
                    <option value="" disabled>담당자를 선택하세요</option>
                    {ASSIGNEES.filter(a => a.id !== "").map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm mb-1 block">Due Date</label>
                  <Input
                    id="due-date"
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    aria-label="Due Date"
                    required
                  />
                </div>

                <Button type="submit">요청 제출</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="etc">
          <Card>
            <CardHeader><CardTitle>기타 문의</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-3 max-w-xl">
                <Textarea placeholder="문의 내용을 입력하세요" rows={6} />
                <Input name="reporter" placeholder="요청자의 사번을 입력해주세요" required />

                <div>
                  <label className="text-sm mb-1 block">Due Date</label>
                  <Input
                    type="date"
                    value={etcDueDate}
                    onChange={(e) => setEtcDueDate(e.target.value)}
                    aria-label="Due Date"
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">Assignee</label>
                  <select
                    value={etcAssignee}
                    onChange={(e) => setEtcAssignee(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    aria-label="Assignee 선택"
                  >
                    {ASSIGNEES.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <Button type="submit">요청 제출</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jira 티켓이 성공적으로 생성되었습니다</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">Mock 동작으로, 실제 티켓은 생성되지 않습니다.</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
// ...existing code...