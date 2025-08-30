import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Helmet } from "react-helmet-async";

export default function AppLayout({ children }) {
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
          <main className="p-6 container mx-auto animate-fade-in">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}