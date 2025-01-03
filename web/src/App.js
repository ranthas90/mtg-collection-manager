import "./App.css";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import SetsOverview from "./components/sets/overview/SetsOverview";
import {LoadingProvider} from "./contexts/loadingContext";
import {TooltipProvider} from "./shared/components/tooltip/Tooltip";
import SetDetail from "./components/sets/detail/SetDetail";
import SettingsOverview from "./components/settings/SettingsOverview";
import PageLayout from "./components/layout/PageLayout";

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <LoadingProvider>
          <Routes>
            <Route path="/" element={<PageLayout />}>
              <Route path="/" element={<Navigate to={"/sets"} />} />
              <Route path="/sets" element={<SetsOverview />} />
              <Route path="/sets/:id" element={<SetDetail />} />
              <Route path="/settings" element={<SettingsOverview />} />
            </Route>
          </Routes>
        </LoadingProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
