import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { importPKCS8, SignJWT } from "jose";

export default function ScgTokenIssuer() {
  const [pem, setPem] = useState("");
  const [iss, setIss] = useState("");
  const [aud, setAud] = useState("");
  const [country, setCountry] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState();

  const generate = async (e) => {
    e.preventDefault();
    setError(undefined);
    try {
      const privateKey = await importPKCS8(pem, "RS256");
      const jwt = await new SignJWT({ country })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(iss)
        .setAudience(aud)
        .setExpirationTime("2h")
        .sign(privateKey);
      setToken(jwt);
    } catch (err) {
      setError(err?.message || "키 형식이 올바르지 않습니다.");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(token);
  };

  return (
    <>
      <Helmet>
        <title>JWT 토큰 발급기 (관리자)</title>
        <meta name="description" content="RS256 개인키로 JWT를 생성합니다." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <Card>
        <CardHeader><CardTitle>JWT 토큰 발급기</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-3 max-w-2xl" onSubmit={generate}>
            <Textarea placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----" value={pem} onChange={(e) => setPem(e.target.value)} rows={8} required />
            <div className="grid md:grid-cols-3 gap-3">
              <Input placeholder="iss" value={iss} onChange={(e) => setIss(e.target.value)} required />
              <Input placeholder="aud" value={aud} onChange={(e) => setAud(e.target.value)} required />
              <Input placeholder="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="submit">토큰 생성</Button>
              <Button type="button" variant="outline" disabled={!token} onClick={copy}>복사</Button>
            </div>
            {error && <div className="text-destructive">{error}</div>}
            <Textarea placeholder="생성된 토큰" value={token} readOnly rows={6} />
          </form>
        </CardContent>
      </Card>
    </>
  );
}
