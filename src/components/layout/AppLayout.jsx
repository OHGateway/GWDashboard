import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Helmet } from "react-helmet-async";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const countries = [
  { id: 1, name: "KR(한국)", code : "KR", icon: "emojione:flag-for-south-korea" },
  { id: 2, name: "EU(유럽)", code : "EU", icon: "circle-flags:eu" },
  { id: 3, name: "US(미국)", code : "US", icon: "emojione:flag-for-united-states" },
  { id: 4, name: "CA(캐나다)", code : "CA", icon: "emojione:flag-for-canada" },
  { id: 6, name: "RU(러시아)", code : "RU", icon: "emojione:flag-for-russia" },
  { id: 8, name: "CN(중국)", code : "CN", icon: "emojione:flag-for-china" },
  { id: 10, name: "JP(일본)", code : "JP", icon: "emojione:flag-for-japan" },
  { id: 11, name: "IN(인도)", code : "IN", icon: "emojione:flag-for-india" }
];

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const storedCode = localStorage.getItem("selectedCountry") || "KR";
  const initialCountry = countries.find(c => c.code === storedCode) || countries[0];
  const pagesWithCountry = ["/scg/routes", "/scg/health-check", "/tyk/apis", "/tyk/health-check"];

  const [selected, setSelected] = useState(initialCountry);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (pagesWithCountry.includes(location.pathname)) {
      // 필요한 페이지면 country 붙이기
      if (!params.get("country")) {
        params.set("country", storedCode);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      }
    } else {
      // 필요 없는 페이지면 country 제거
      if (params.has("country")) {
        params.delete("country");
        navigate(`${location.pathname}`, { replace: true });
      }
    }
  }, [location.pathname]);
  

  const handleSelect = (country) => {
    setSelected(country);
    setOpen(false);
    localStorage.setItem("selectedCountry", country.code);
  
    const params = new URLSearchParams(location.search);
  
    if (pagesWithCountry.includes(location.pathname)) {
      params.set("country", country.code);
      navigate(`${location.pathname}?${params.toString()}`);
    } else {
      navigate(location.pathname); // 쿼리파람 없이
    }
  };
  

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <Helmet>
            <title>Gateway 대시보드</title>
            <meta name="description" content="Gateway를 모니터링하고 요청을 처리하는 관리자 대시보드"/>
            <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/"}/>
          </Helmet>

          <header className="h-12 flex items-center justify-between border-b p-4 shadow-sm">
            <div className="relative inline-block w-60">
              <button type="button" onClick={() => setOpen(!open)} className="flex items-center justify-between w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Icon icon={selected.icon} className="w-5 h-5" />
                  <span className="text-sm">{selected.name}</span>
                </div>
                <Icon icon={open ? "mdi:chevron-up" : "mdi:chevron-down"} className="w-4 h-4 text-gray-500"/>
              </button>

              {open && (
                <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 shadow-lg">
                  <ul className="max-h-64 overflow-y-auto">
                    {countries.map((country) => (
                      <li key={country.id} onClick={() => handleSelect(country)}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-secondary hover:bg-accent"
                      >
                        <div className="flex items-center gap-2">
                          <Icon icon={country.icon} className="w-5 h-5" />
                          <span className="text-sm">{country.name}</span>
                        </div>
                        {selected.id === country.id && (
                          <Icon icon="mdi:check" className="w-4 h-4 text-blue-500" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <select name="country" value={selected.id} readOnly className="hidden">
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <main className="flex flex-col gap-6 w-full max-w-none p-6 animate-fade-in">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
