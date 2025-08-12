import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_DATA } from "@/config";

export default function ScgHealthCheck() {
  const [endpoints, setEndpoints] = useState(MOCK_DATA.scgHealthEndpoints);
  const [newEp, setNewEp] = useState("");
  const [results, setResults] = useState({});

  const add = () => {
    if (!newEp) return;
    setEndpoints((prev) => [...prev, newEp]);
    setNewEp("");
  };
  const remove = (ep) => setEndpoints((prev) => prev.filter((e) => e !== ep));

  const check = (ep?: string) => {
    const list = ep ? [ep] : endpoints;
    list.forEach((e, idx) => {
      setResults((r) => ({ ...r, [e]: "idle" }));
      setTimeout(() => {
        const ok = Math.random() > 0.15;
        setResults((r) => ({ ...r, [e]: ok ? "ok" : "error" }));
      }, 500 + idx * 150);
    });
  };

  return (
    <>
      <Helmet>
        <title>SCG 통신 상태 확인</title>
        <meta name="description" content="사용자 정의 엔드포인트를 추가하고 상태를 모니터링하세요." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <div className="grid gap-4">
        <Card>
          <CardHeader><CardTitle>엔드포인트 관리</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-3">
            <Input placeholder="https://service-x.com/health" value={newEp} onChange={(e) => setNewEp(e.target.value)} />
            <Button onClick={add}>추가</Button>
            <Button variant="outline" onClick={() => check()}>전체 상태 확인</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>상태</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>엔드포인트</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoints.map((e) => (
                  <TableRow key={e}>
                    <TableCell>{e}</TableCell>
                    <TableCell>
                      {results[e] === "ok" ? "정상" : results[e] === "error" ? "오류" : "대기"}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => check(e)}>확인</Button>
                      <Button size="sm" variant="outline" onClick={() => remove(e)}>삭제</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
