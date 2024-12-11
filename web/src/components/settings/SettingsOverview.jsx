import BreadcrumbHeader from "../../shared/components/breadcrumb/BreadcrumbHeader";

const SettingsOverview = () => {
  const breadcrumItems = [{ title: "Settings" }];
  return (
    <>
      <BreadcrumbHeader items={breadcrumItems} />
      <div>Settings go here!</div>
    </>
  );
};

export default SettingsOverview;
