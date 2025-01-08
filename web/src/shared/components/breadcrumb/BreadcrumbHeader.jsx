import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator,} from "./Breadcrumb";
import {SidebarTrigger} from "../sidebar/Sidebar";
import {Separator} from "../separator/Separator";

const BreadcrumbHeader = ({ items }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1"/>
      <Separator orientation="vertical" className="mr-2 h-4"/>
      <Breadcrumb>
        <BreadcrumbList>
          {items && items.map(item => (
            <>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={item.link}>
                  {item.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block"/>
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};

export default BreadcrumbHeader;
