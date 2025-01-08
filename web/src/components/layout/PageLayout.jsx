import {SidebarInset, SidebarProvider} from "../../shared/components/sidebar/Sidebar";
import MainSidebar from "./MainSidebar";
import {Outlet} from "react-router-dom";

const PageLayout = () => {
  return (
    <SidebarProvider style={{"--sidebar-width": "15rem"}}>
      <MainSidebar/>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default PageLayout;