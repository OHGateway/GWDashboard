import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function TykRequest() {
  const [open, setOpen] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setOpen(true);
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
                <Input placeholder="API 이름" required />
                <Input placeholder="Listen Path (예: /order-service/)" required />
                <Input placeholder="Target URL (예: https://orders.example.com)" required />
                <Button type="submit" variant="default">요청 제출</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="edit">
          <Card>
            <CardHeader><CardTitle>기존 Listen Path 수정</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-3 max-w-xl">
                <Input placeholder="기존 Listen Path" required />
                <Input placeholder="변경할 Listen Path" required />
                <Textarea placeholder="변경 사유" />
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
          <DialogHeader>
            <DialogTitle>Jira 티켓이 성공적으로 생성되었습니다</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">Mock 동작으로, 실제 티켓은 생성되지 않습니다.</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
