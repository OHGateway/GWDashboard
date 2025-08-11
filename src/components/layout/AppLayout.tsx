import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAdmin, logout } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <Helmet>
            <title>Gateway 대시보드 | titan-terminal</title>
            <meta name="description" content="TYK 및 Spring Cloud Gateway를 모니터링하고 요청을 처리하는 관리자 대시보드" />
            <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
          </Helmet>
          <header className="h-14 flex items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-semibold">Gateway 관리 대시보드</span>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <Button variant="outline" onClick={logout}>로그아웃</Button>
              ) : (
                <Button asChild variant="outline">
                  <Link to="/login">관리자 로그인</Link>
                </Button>
              )}
            </div>
          </header>
          <main className="p-6 container mx-auto animate-fade-in">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
