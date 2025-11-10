import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../../components/ui/sidebar.tsx";
import { GalleryVerticalEnd, Home } from "lucide-react";
import { Link, Outlet } from "react-router";

const sidebarItems = [
  { title: "Dashboard/Home", href: "/", icon: Home },
  { title: "My Collection", href: "/my-collection", icon: Home },
  { title: "MTG Expansions", href: "/mtg-expansions", icon: Home },
  { title: "Data sync", href: "/data-sync", icon: Home },
  { title: "Settings", href: "/settings", icon: Home },
];

export function Layout() {
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to={"/"}>
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">MTG Collection Manager</span>
                    <span className="">v1.0.0</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 min-h-screen flex-col bg-muted/40 w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </>
  );
}
