import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location && location.state && location.state.from) ? location.state.from : "/";

  const onSubmit = (e) => {
    e.preventDefault();
    const ok = login(id, password);
    if (ok) {
      toast({ title: "로그인 성공", description: "관리자 권한이 활성화되었습니다." });
      navigate(from, { replace: true });
    } else {
      toast({ title: "로그인 실패", description: error || "다시 시도하세요.", variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet>
        <title>관리자 로그인 | Gateway 대시보드</title>
        <meta name="description" content="관리자 전용 페이지 접근을 위한 로그인" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>관리자 로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <label htmlFor="id">아이디</label>
                <Input id="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="ccsgateway" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="password">비밀번호</label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="GWAdmin!1" />
              </div>
              <Button type="submit" variant="default" className="hover-scale">로그인</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
