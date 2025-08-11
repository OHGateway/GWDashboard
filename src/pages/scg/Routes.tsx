import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_DATA } from "@/config";

export default function ScgRoutes() {
  const [q, setQ] = useState("");
  const routes = useMemo(() => MOCK_DATA.scgRoutes, []);
  const data = useMemo(() => {
    return routes.filter((r) => [r.id, r.uri].some((v) => v.toLowerCase().includes(q.toLowerCase())));
  }, [q, routes]);

  return (
    <>
      <Helmet>
        <title>SCG 라우터 정보</title>
        <meta name="description" content="Spring Cloud Gateway 라우팅 및 글로벌 필터 정보를 확인하세요." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">라우터 정보</h1>
          <Input placeholder="Route ID 또는 URI 검색" className="max-w-sm" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <Card>
          <CardHeader><CardTitle>Routes</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>URI</TableHead>
                  <TableHead>Predicates</TableHead>
                  <TableHead>Filters</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.uri}</TableCell>
                    <TableCell>{r.predicates.join(", ")}</TableCell>
                    <TableCell>{r.filters.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Global Filters</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {MOCK_DATA.scgGlobalFilters.map((f, i) => (
                <li key={i}>{f.name} {f.args ? JSON.stringify(f.args) : null}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
