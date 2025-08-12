import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { LayoutGrid, Network, ShieldCheck, Server, KeySquare, CalendarClock } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const current = location.pathname;
  const { state } = useSidebar();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/70";

  return (
    <Sidebar collapsible={"icon"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메인</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end className={linkClass}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    {state === "expanded" && <span>대시보드</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>TYK Gateway</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/tyk/apis" className={linkClass}>
                    <Network className="mr-2 h-4 w-4" />
                    <span>API 목록</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/tyk/health-check" className={linkClass}>
                    <Server className="mr-2 h-4 w-4" />
                    <span>통신 상태</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/tyk/certs" className={linkClass}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>인증서 관리</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/tyk/request" className={linkClass}>
                    <KeySquare className="mr-2 h-4 w-4" />
                    <span>업무 요청</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Spring Cloud Gateway</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/scg/routes" className={linkClass}>
                    <Network className="mr-2 h-4 w-4" />
                    <span>라우터 정보</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/scg/health-check" className={linkClass}>
                    <Server className="mr-2 h-4 w-4" />
                    <span>통신 상태</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/scg/token-issuer" className={linkClass}>
                    <KeySquare className="mr-2 h-4 w-4" />
                    <span>JWT 토큰 발급기</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/scg/request" className={linkClass}>
                    <KeySquare className="mr-2 h-4 w-4" />
                    <span>업무 요청</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>관리자</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/admin/jira-calendar" className={linkClass}>
                    <CalendarClock className="mr-2 h-4 w-4" />
                    <span>Jira 캘린더</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
