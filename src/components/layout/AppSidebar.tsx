import { ModeToggle } from "@/components/mode-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useUserStats } from "@/hooks/useUserStats";
import { CheckCircle2, ListTodo, LogOut, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "./UserAvatar";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useUserStats(user?.id);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <Sidebar>
      {/* Header - User Profile */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-1.5">
              <UserAvatar user={user} className="h-10 w-10" />
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <span className="truncate text-sm font-semibold">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          {user.role && (
            <SidebarMenuItem>
              <div className="px-2">
                <span className="inline-flex items-center rounded-full bg-sidebar-accent px-2.5 py-0.5 text-xs font-medium text-sidebar-accent-foreground">
                  {user.role}
                </span>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>

      {/* Content - Statistics */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Statistics</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <SidebarMenu>
                {[1, 2, 3].map((i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-auto py-3" asChild>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <ListTodo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-muted-foreground">
                          Total Tasks
                        </span>
                        <span className="text-xl font-bold">
                          {stats.totalTasks}
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton className="h-auto py-3" asChild>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-muted-foreground">
                          Completed
                        </span>
                        <span className="text-xl font-bold">
                          {stats.completedTasks}
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton className="h-auto py-3" asChild>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-muted-foreground">
                          Completion
                        </span>
                        <span className="text-xl font-bold">
                          {stats.completionRate}%
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - Logout & Theme Toggle */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2">
              <SidebarMenuButton onClick={handleLogout} className="flex-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
              <ModeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
