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
import { Home } from "lucide-react";
import { Link, Outlet } from "react-router";

const sidebarItems = [
  { title: "Dashboard/Home", href: "/", icon: Home },
  { title: "My Collection", href: "/my-collection", icon: Home },
  { title: "MTG Expansions", href: "/mtg-expansions", icon: Home },
  { title: "Settings", href: "/settings", icon: Home },
];

export function Layout() {
  return (
    <>
      <Sidebar>
        <SidebarHeader>Este es el header</SidebarHeader>
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
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </>
  );
}
