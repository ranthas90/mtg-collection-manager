import { Outlet, useLocation } from "react-router-dom";
import AsideNavigationMenu from "./AsideNavigationMenu";
import { useEffect, useState } from "react";

const Layout = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(location.pathname);
    console.log(location.path);
  }, [currentPath]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AsideNavigationMenu />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
