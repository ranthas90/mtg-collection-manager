import {Link} from "react-router-dom";
import MobileSheetNavigationMenu from "../../../layout/MobileSheetNavigationMenu";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator,} from "./Breadcrumb";

const BreadcrumbHeader = ({ items }) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MobileSheetNavigationMenu />
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {items &&
            items.map((item) => (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={item.link}>{item.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};

export default BreadcrumbHeader;
