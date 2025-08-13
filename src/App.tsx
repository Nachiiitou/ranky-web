// src/App.tsx
import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "./app/pages/components/Navbar";
import Footer from "./app/pages/components/Footer";
import Hero from "./app/pages/components/Hero";

export default function App() {
  const { i18n } = useTranslation();
  const { lng } = useParams<{ lng?: string }>();
  const location = useLocation();

  // Sincroniza :lng con i18n y <html lang/dir>
  useEffect(() => {
    const next = lng === "en" ? "en" : "es";
    const current = (i18n.language || "").split("-")[0];
    if (current !== next) i18n.changeLanguage(next);
    const html = document.documentElement;
    html.lang = next;
    html.dir = "ltr";
  }, [lng, i18n]);

  // Scroll al top en cada navegación dentro de /:lng/*
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#050505] text-white ">
      <Navbar />

      <Hero />
      <Routes>
        {/* /:lng */}

        {/* futuros paths: /:lng/lo-que-sea
        <Route path="features" element={<Features />} />
        */}

        {/* fallback dentro de :lng */}
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>

      <Footer />
    </div>
  );
}
