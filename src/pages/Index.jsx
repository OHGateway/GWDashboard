import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Icon } from "@iconify/react";

const countries = [
  { id: 1, name: "KR(한국)", icon: "emojione:flag-for-south-korea" },
  { id: 2, name: "EU(유럽)", icon: "circle-flags:eu" },
  { id: 3, name: "US(미국)", icon: "emojione:flag-for-united-states" },
  { id: 4, name: "CA(캐나다)", icon: "emojione:flag-for-canada" },
  { id: 6, name: "RU(러시아)", icon: "emojione:flag-for-russia" },
  { id: 8, name: "CN(중국)", icon: "emojione:flag-for-china" },
  { id: 10, name: "JP(일본)", icon: "emojione:flag-for-japan" },
  { id: 11, name: "IN(인도)", icon: "emojione:flag-for-india" }
];

const StatusCard = ({ name, icon, status }) => {
  const getStatusLabel = (s) => {
    switch (s) {
      case "normal": return "정상";
      case "warning": return "주의";
      case "danger": return "위험";
      default: return "대기";
    }
  };

  return (
    <Card className="flex flex-row items-center hover-scale w-full">
      <CardHeader className="flex-1 flex flex-row items-center gap-2">
        <Icon icon={icon} className="w-7 h-7" />
        <CardTitle className="text-left">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2 pt-2">
        {status === "normal" && <CheckCircle2 color="green" className="text-green-500" />}
        {status === "warning" && <AlertTriangle color="orange" className="text-yellow-500" />}
        {status === "danger" && <XCircle color="red" className="text-red-500" />}
        <span>{getStatusLabel(status)}</span>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const [tykStatuses, setTykStatuses] = useState({});
  const [msaStatuses, setMsaStatuses] = useState({});
  const [lastChecked, setLastChecked] = useState();

  const randomStatus = () => {
    const r = Math.random();
    if (r > 0.9) return "danger";
    if (r > 0.8) return "warning";
    return "normal";
  };

  const checkAll = () => {
    setLastChecked(new Date().toLocaleString());
    const newTyk = {};
    const newMsa = {};
    countries.forEach(c => {
      newTyk[c.name] = randomStatus();
      newMsa[c.name] = randomStatus();
    });
    setTimeout(() => setTykStatuses(newTyk), 500);
    setTimeout(() => setMsaStatuses(newMsa), 800);
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

      <div className="flex flex-col gap-6 w-full ">
        <div className="flex flex-row justify-between md:flex-row gap-6 w-full">
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col flex-1 w-full p-4">
            <span className="font-semibold mb-2 p-2">Information</span>
            <div className="flex flex-row gap-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50 w-full">
              <Button asChild variant="hero" className="hover-scale w-full text-center md:w-1/2 h-16 p-4">
                <Link to="/tyk/request">API Gateway(TYK) <br /> LISTEN PATH</Link>
              </Button>
              <Button asChild variant="hero" className="hover-scale w-full text-center md:w-1/2 h-16 p-4">
                <Link to="/scg/request">MSA API Gateway  <br /> ROUTE</Link>
              </Button>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col flex-1 w-full p-4">
            <span className="font-semibold mb-2 p-2">업무요청</span>
            <div className="flex flex-row gap-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50 w-full">
              <Button asChild variant="hero" className="hover-scale w-full text-center md:w-1/2 h-16 p-4">
                <Link to="/tyk/request">API Gateway(TYK) <br /> 업무요청 바로가기</Link>
              </Button>
              <Button asChild variant="hero" className="hover-scale w-full text-center md:w-1/2 h-16 p-4">
                <Link to="/scg/request">MSA API Gateway <br /> 업무요청 바로가기</Link>
              </Button>
            </div>
          </motion.section>
        </div>

         <div className="flex flex-row md:flex-row gap-6 w-full">
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}  className="flex flex-col flex-1 w-full p-4">
            <span className="font-semibold mb-2 p-2">API Gateway(TYK) State</span>
            <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50 w-full">
              <div className="flex ml-auto">
                <Button variant="outline" onClick={checkAll}>상태 재확인</Button>
              </div>
              <div className="flex flex-col gap-4 w-full">
                {countries.map(c => (
                  <StatusCard key={c.id} name={c.name} icon={c.icon} status={tykStatuses[c.name]} />
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}  className="flex flex-col flex-1 w-full p-4">
            <span className="font-semibold mb-2 p-2">MSA API Gateway State</span>
            <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50 w-full">
              <div className="flex ml-auto">
                <Button variant="outline" onClick={checkAll}>상태 재확인</Button>
              </div>
              <div className="flex flex-col gap-4 w-full">
                {countries.map(c => (
                  <StatusCard key={c.id} name={c.name} icon={c.icon} status={msaStatuses[c.name]} />
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Index;