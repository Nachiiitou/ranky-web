import { Trans, useTranslation } from "react-i18next";
import logoUrl from "/ranky-logo.png";
import logoDiscord from "/discord-logo.svg";
import { Github, Twitter, Globe } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation("common", { keyPrefix: "footer" });
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 text-white overflow-hidden">
      {/* línea neón superior */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-emerald-400/80 shadow-[0_0_16px_#10B981] z-10" />

      {/* Fondo base */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#0B0B0B]" />



      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 bg-[length:200%_100%] animate-[pan_28s_linear_infinite]"
        style={{
          background:
            "linear-gradient(115deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.12) 35%, rgba(88,101,242,0.08) 55%, rgba(16,185,129,0.12) 70%, rgba(16,185,129,0) 100%)",
        }}
      />

      {/*glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(70%_70%_at_60%_40%,black,transparent)] bg-[size:28px_28px,28px_28px] [background-position:0px_60px,0px_60px] animate-[drift_120s_linear_infinite]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 left-[-15%] bottom-[-25%] w-[55vw] h-[55vh] bg-[radial-gradient(50%_50%_at_0%_100%,rgba(16,185,129,0.18),rgba(0,0,0,0))]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 right-[-10%] top-[-30%] w-[45vw] h-[45vh] bg-[radial-gradient(50%_50%_at_100%_0%,rgba(88,101,242,0.12),rgba(0,0,0,0))]"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          


          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <span className="relative">
                <span className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md -z-10" />
                <img
                  src={logoUrl}
                  alt={t("brandAlt")}
                  className="h-10 w-10 rounded-full border border-white/10 p-1 shadow-[0_0_30px_rgba(16,185,129,0.25)] backdrop-blur"
                />
              </span>
              <h3 className="text-xl font-extrabold tracking-wide">RANKY</h3>
            </div>

            <p className="mt-3 text-white/70 text-sm max-w-xs">
              {t("tagline")}
            </p>


            {/* CTA */}
            <div className="mt-5">
              <a
                href="https://discord.com/oauth2/authorize?client_id=1005188427634966629&permissions=268528656&scope=bot+applications.commands"
                target="_blank"
                rel="noopener noreferrer"
                title={t("ctaPrimary")}
                className="group relative inline-flex items-center gap-2 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 text-sm font-semibold shadow-[0_8px_22px_rgba(88,101,242,0.35)] ring-1 ring-white/10 hover:ring-emerald-300/30 transition-colors"
              >
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute -left-1/2 top-0 h-full w-1/2 translate-x-[-120%] group-hover:translate-x-[320%] transition-transform duration-700 ease-out -skew-x-12 bg-white/20 blur-lg" />
                </span>
                <img src={logoDiscord} alt="" className="w-5 h-5" />
                <span>{t("ctaPrimary")}</span>
              </a>
            </div>
          </div>




          {/* Columnas de enlaces */}
          <nav className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
            {/* Producto */}
            <div>
              <h4 className="text-white font-semibold">{t("product.title")}</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>
                  <a href="#how" className="hover:text-white">
                    {t("product.how")}
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white">
                    {t("product.features")}
                  </a>
                </li>
                <li>
                  <a href="#usage" className="hover:text-white">
                    {t("product.usage")}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white">
                    {t("product.faq")}
                  </a>
                </li>
              </ul>
            </div>


            {/* Comunidad */}
            <div>
              <h4 className="text-white font-semibold">
                {t("community.title")}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>
                  <a
                    href="https://discord.com/invite/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#credits" className="hover:text-white">
                    {t("community.credits")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold">{t("legal.title")}</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>
                  <a href="#privacy" className="hover:text-white">
                    {t("legal.privacy")}
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white">
                    {t("legal.terms")}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    {t("legal.contact")}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Separador + Social + Copyright + Créditos */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              aria-label="Discord"
              href="https://discord.com/invite/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/5 border border-white/10 p-2 hover:bg-white/10 transition"
            >
              <img src={logoDiscord} alt="" className="w-5 h-5" />
            </a>
            <a
              aria-label="GitHub"
              href="https://github.com/MKGF/Ranky"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/5 border border-white/10 p-2 hover:bg-white/10 transition"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              aria-label="Twitter/X"
              href="https://x.com/BotRanky"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/5 border border-white/10 p-2 hover:bg-white/10 transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              aria-label="Website"
              href="https://www.Zennith.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/5 border border-white/10 p-2 hover:bg-white/10 transition"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>

          {/* Right column: copyright + créditos */}
          <div className="flex flex-col items-start sm:items-end gap-1">
            <p className="text-xs text-white/60">
              © {year} Ranky. {t("rights")}
            </p>
            <p className="text-xs text-white/60">
              <Trans
                t={t}
                i18nKey="madeBy"
                components={{
                  heart: <span aria-hidden="true">❤️</span>,
                  a: (
                    <a
                      href="https://www.Zennith.cl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/30 hover:decoration-emerald-400 hover:text-white"
                    />
                  ),
                }}
              />
            </p>
          </div>
        </div>

        {/* Disclaimer Riot */}
        <div className="mt-3 text-[11px] leading-relaxed text-white/50 max-w-4xl">
          <Trans
            t={t}
            i18nKey="riotNotice"
            components={{
              a: (
                <a
                  href="https://www.riotgames.com/en/legal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/30 hover:decoration-emerald-400 hover:text-white"
                />
              ),
            }}
          />
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes pan { from { background-position: 0% 0%; } to { background-position: 200% 0%; } }
        @keyframes drift { from { background-position: 0px 60px, 0px 60px; } to { background-position: 200px 60px, 200px 60px; } }
      `}</style>
    </footer>
  );
}
