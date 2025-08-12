import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_DATA } from "@/config";

export default function TykApis() {
  const [q, setQ] = useState("");
  const data = useMemo(() => {
    return MOCK_DATA.tykApis.filter((api) =>
      [api.name, api.listen_path].some((v) => v.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q]);

  return (
    <>
      <Helmet>
        <title>TYK API 목록 | Listen Path 검색</title>
        <meta name="description" content="TYK Gateway에 등록된 API를 검색하고 확인하세요." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">TYK API 목록</h1>
          <Input placeholder="이름 또는 Listen Path 검색" className="max-w-sm" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>Listen Path</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((api) => (
                <TableRow key={api.id}>
                  <TableCell>{api.name}</TableCell>
                  <TableCell>{api.listen_path}</TableCell>
                  <TableCell>{api.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}
