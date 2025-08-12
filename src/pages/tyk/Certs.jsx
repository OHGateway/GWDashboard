import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_DATA } from "@/config";

export default function TykCerts() {
  const [certs, setCerts] = useState(MOCK_DATA.tykCerts);
  const [cn, setCn] = useState("");
  const [exp, setExp] = useState("");
  const [issuer, setIssuer] = useState("");

  const addCert = () => {
    if (!cn || !exp) return;
    setCerts((prev) => [{ id: crypto.randomUUID(), commonName: cn, expiresAt: exp, issuer: issuer || "Custom" }, ...prev]);
    setCn(""); setExp(""); setIssuer("");
  };
  const remove = (id: string) => setCerts((prev) => prev.filter((c) => c.id !== id));

  return (
    <>
      <Helmet>
        <title>TYK 인증서 관리 (관리자)</title>
        <meta name="description" content="TYK 인증서 목록을 확인하고 추가/삭제할 수 있습니다." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>인증서 추가</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-3">
            <Input placeholder="Common Name" value={cn} onChange={(e) => setCn(e.target.value)} />
            <Input type="date" placeholder="만료일" value={exp} onChange={(e) => setExp(e.target.value)} />
            <Input placeholder="발급자 (옵션)" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
            <Button onClick={addCert}>추가</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>인증서 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CN</TableHead>
                  <TableHead>만료일</TableHead>
                  <TableHead>발급자</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certs.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.commonName}</TableCell>
                    <TableCell>{c.expiresAt}</TableCell>
                    <TableCell>{c.issuer}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => remove(c.id)}>삭제</Button>
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
