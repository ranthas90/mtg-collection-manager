import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import { DashboardPage } from "./app/dashboard/dashboard-page.tsx";
import { MyCollectionPage } from "./app/my-collection/my-collection-page.tsx";
import MtgExpansionsPage from "./app/mtg-expansions/mtg-expansions-page.tsx";
import { SettingsPage } from "./app/settings/settings-page.tsx";
import { Layout } from "./app/layout/layout.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-collection" element={<MyCollectionPage />} />
        <Route path="/mtg-expansions" element={<MtgExpansionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
