import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

const StatusCard = ({ name, status, lastChecked }) => (
  <Card className="hover-scale">
    <CardHeader>
      <CardTitle>{name}</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {status === "ok" && <CheckCircle2 className="text-primary" />}
        {status === "error" && <XCircle className="text-destructive" />}
        <span>{status === "idle" ? "대기" : status === "ok" ? "정상" : "오류"}</span>
      </div>
      <div className="text-sm text-muted-foreground">{lastChecked ? `마지막 확인: ${lastChecked}` : "아직 확인 전"}</div>
    </CardContent>
  </Card>
);

const Index = () => {
  const [tykStatus, setTykStatus] = useState("idle");
  const [scgStatus, setScgStatus] = useState("idle");
  const [lastChecked, setLastChecked] = useState();

  const checkAll = () => {
    setLastChecked(new Date().toLocaleString());
    // Simulate API calls
    setTimeout(() => setTykStatus(Math.random() > 0.1 ? "ok" : "error"), 600);
    setTimeout(() => setScgStatus(Math.random() > 0.1 ? "ok" : "error"), 800);
  };

  useEffect(() => {
    checkAll();
  }, []);

  return (
    <>
      <Helmet>
        <title>메인 대시보드 | Gateway 상태 & 업무 요청</title>
        <meta name="description" content="TYK / SCG 상태를 한눈에 확인하고 업무 요청을 바로 처리하세요." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>
      <div className="grid gap-6">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-2 gap-4">
          <Button asChild size="lg" variant="hero" className="hover-scale">
            <Link to="/tyk/request">TYK Gateway 업무 요청 바로가기</Link>
          </Button>
          <Button asChild size="lg" variant="hero" className="hover-scale">
            <Link to="/scg/request">Spring Cloud Gateway 업무 요청 바로가기</Link>
          </Button>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }} className="grid md:grid-cols-2 gap-4">
          <StatusCard name="TYK Gateway" status={tykStatus} lastChecked={lastChecked} />
          <StatusCard name="Spring Cloud Gateway" status={scgStatus} lastChecked={lastChecked} />
        </motion.section>

        <div className="flex gap-3">
          <Button variant="outline" onClick={checkAll}>상태 재확인</Button>
        </div>
      </div>
    </>
  );
};

export default Index;
