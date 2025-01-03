import {SidebarInset, SidebarProvider, SidebarTrigger} from "../../shared/components/sidebar/Sidebar";
import MainSidebar from "./MainSidebar";
import {Separator} from "../../shared/components/separator/Separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "../../shared/components/breadcrumb/Breadcrumb";
import {Outlet} from "react-router-dom";

const PageLayout = () => {
  return (
    <SidebarProvider style={{"--sidebar-width": "15rem"}}>
      <MainSidebar/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1"/>
          <Separator orientation="vertical" className="mr-2 h-4"/>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Building your application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block"/>
              <BreadcrumbItem>
                <BreadcrumbPage>Data fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default PageLayout;