import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "./lib/i18n/i18n"; // <- existe: src/lib/i18n/i18n.ts
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/ranky-web">
      <Routes>
        <Route path="/:lng/*" element={<App />} />
        <Route path="*" element={<Navigate to="/es" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
