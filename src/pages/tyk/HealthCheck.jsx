import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function TykHealthCheck() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const onCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus(Math.random() > 0.1 ? "ok" : "error");
      setLoading(false);
    }, 900);
  };

  return (
    <>
      <Helmet>
        <title>TYK 통신 상태 확인</title>
        <meta name="description" content="TYK Gateway /hello 엔드포인트를 시뮬레이션하여 상태를 확인합니다." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <Card>
        <CardHeader>
          <CardTitle>TYK Gateway Health Check</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === "ok" && <CheckCircle2 className="text-green-500" />}
            {status === "error" && <XCircle className="text-red-500" />}
            <span>{status === "idle" ? "대기" : status === "ok" ? "정상" : "오류"}</span>
          </div>
          <Button onClick={onCheck} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 animate-spin" /> 확인 중...</> : "상태 확인"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
