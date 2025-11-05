import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { SidebarProvider } from "./components/ui/sidebar.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SidebarProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </SidebarProvider>
  </BrowserRouter>,
);
