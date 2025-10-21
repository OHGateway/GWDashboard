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
import { LayoutGrid, Network, HeartPulse, KeySquare, CalendarClock, LogIn, LogOut, ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/store/auth";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  const current = location.pathname;
  const { state } = useSidebar();
  const { isAdmin, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/70";

  return (
    <Sidebar collapsible={"icon"}>
      <SidebarContent className="flex flex-col h-full">
        <div className="flex justify-center mt-4">
          {state === "expanded" && <span className="font-semibold">Gateway 관리 대시보드</span>}
        </div>
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
          <SidebarGroupLabel>API GATEWAY(TYK)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/tyk/apis" className={linkClass}>
                    <Network className="mr-2 h-4 w-4" />
                    <span>Listen Path 정보</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/tyk/health-check" className={linkClass}>
                    <HeartPulse className="mr-2 h-4 w-4" />
                    <span>통신 상태</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/tyk/request" className={linkClass}>
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    <span>업무 요청</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>MSA API GATEWAY</SidebarGroupLabel>
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
                    <HeartPulse className="mr-2 h-4 w-4" />
                    <span>통신 상태</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAdmin && (
                <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/scg/token-issuer" className={linkClass}>
                    <KeySquare className="mr-2 h-4 w-4" />
                    <span>JWT 토큰 발급기</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/scg/request" className={linkClass}>
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    <span>업무 요청</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>PROXY</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/tyk/health-check" className={linkClass}>
                    <HeartPulse className="mr-2 h-4 w-4" />
                    <span>통신 상태</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
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
        )}
        
        <div className="flex items-center justify-between border-t p-4 mt-auto">
            {state === "expanded" && (
              <div className="flex items-center gap-2">
              {isAdmin ? (
                <Button variant="outline" onClick={logout}> 
                <LogOut className="mr-2 h-4 w-4" /> 
                <span>로그아웃</span>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" /> 
                  <span>관리자 로그인</span>
                  </Link>
                </Button>
              )}
            </div>
            )}
            <SidebarTrigger />  
        </div>
        
      </SidebarContent>
    </Sidebar>
  );
}
