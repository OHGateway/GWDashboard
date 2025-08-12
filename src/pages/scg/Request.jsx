import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ScgRequest() {
  const [open, setOpen] = useState(false);
  const submit = (e) => { e.preventDefault(); setOpen(true); };

  return (
    <>
      <Helmet>
        <title>SCG 업무 요청</title>
        <meta name="description" content="라우터 신규/수정 요청 및 기타 문의를 접수하세요." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">라우터 신규 등록</TabsTrigger>
          <TabsTrigger value="edit">라우터 수정 요청</TabsTrigger>
          <TabsTrigger value="etc">기타 문의</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <Card>
            <CardHeader><CardTitle>라우터 신규 등록</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-3 max-w-xl">
                <Input placeholder="Route ID" required />
                <Input placeholder="URI (예: lb://user-service)" required />
                <Input placeholder="Predicates (쉼표 구분)" />
                <Input placeholder="Filters (쉼표 구분)" />
                <Button type="submit">요청 제출</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="edit">
          <Card>
            <CardHeader><CardTitle>라우터 수정 요청</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-3 max-w-xl">
                <Input placeholder="기존 Route ID" required />
                <Textarea placeholder="수정 내용" rows={4} />
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
                <Button type="submit">요청 제출</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Jira 티켓이 성공적으로 생성되었습니다</DialogTitle></DialogHeader>
          <div className="text-sm text-muted-foreground">Mock 동작으로, 실제 티켓은 생성되지 않습니다.</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
