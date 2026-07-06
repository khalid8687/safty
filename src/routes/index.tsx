import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { translations, type Lang } from "@/lib/i18n";
import logo from "@/assets/switches-market-logo.jpg";
import cisco7945 from "@/assets/cisco-7945.jpg";
import cisco7841 from "@/assets/cisco-7841.webp";
import cucmServer from "@/assets/cucm-server.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";
import networkViz from "@/assets/network-viz.jpg";

export const Route = createFileRoute("/")({
  component: QuotePage,
});

const PHONE = "201002194451";
const WHATSAPP = `https://wa.me/${PHONE}`;
const TEL = `tel:+${PHONE}`;

function formatK(n: number) {
  if (n >= 1000) {
    const k = n / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return n.toString();
}

function formatDate(d: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

function QuotePage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  const today = useMemo(() => new Date(), []);
  const validUntil = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 7);
    return d;
  }, [today]);

  const refNo = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `SM-${y}${m}${d}-VOIP`;
  }, [today]);

  const items = [
    { key: "server", price: 25000, qty: 1, image: cucmServer, data: t.items.server },
    { key: "license", price: 120000, qty: 1, image: networkViz, data: t.items.license },
    { key: "p7945", price: 1200, qty: 1, image: cisco7945, data: t.items.p7945 },
    { key: "p7841", price: 2100, qty: 1, image: cisco7841, data: t.items.p7841 },
  ];

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const vat = subtotal * 0.14;
  const grand = subtotal + vat;

  return (
    <div className="min-h-screen text-foreground" style={{ background: "var(--gradient-hero)" }}>
      <TopBar lang={lang} setLang={setLang} t={t} />
      <Hero t={t} lang={lang} />
      <QuoteMeta t={t} lang={lang} today={today} validUntil={validUntil} refNo={refNo} />
      <Overview t={t} />
      <Steps t={t} />
      <Benefits t={t} />
      <Devices t={t} items={items} />
      <PriceTable t={t} items={items} subtotal={subtotal} vat={vat} grand={grand} />
      <Validity t={t} validUntil={validUntil} lang={lang} />
      <Contact t={t} />
      <Footer t={t} />
      <FloatingCTA t={t} />
    </div>
  );
}

/* ---------- TopBar ---------- */

function TopBar({ lang, setLang, t }: { lang: Lang; setLang: (l: Lang) => void; t: typeof translations["en"] }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[oklch(0.09_0.04_260/0.7)] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Switches Market" className="h-10 sm:h-12 w-auto" />
          <div className="hidden sm:block">
            <div className="text-xs uppercase tracking-widest text-cyan">{t.tagline}</div>
          </div>
        </div>
        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="glass hover:glow-cyan transition-all px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          {t.langLabel}
        </button>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero({ t, lang }: { t: typeof translations["en"]; lang: Lang }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <img src={heroHotel} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.09_0.04_260/0.6)] to-[oklch(0.09_0.04_260)]" />
      </motion.div>

      <div
        className="absolute inset-0 z-0 opacity-30 animate-grid"
        style={{
          backgroundImage: "linear-gradient(oklch(0.75 0.15 210 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.15 210 / 0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: 300 + i * 100,
            height: 300 + i * 100,
            background: i === 0 ? "oklch(0.7 0.25 220 / 0.35)" : i === 1 ? "oklch(0.6 0.25 280 / 0.3)" : "oklch(0.75 0.2 200 / 0.25)",
            top: `${10 + i * 20}%`,
            left: `${5 + i * 30}%`,
          }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs uppercase tracking-[0.25em] mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            {t.heroKicker}
          </div>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-display)" }}
          >
            <span className="gradient-text">{t.heroTitle}</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
            {t.heroSub}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#overview"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-primary-foreground transition-all hover:scale-105"
              style={{ background: "var(--gradient-cyan)", boxShadow: "var(--shadow-glow)" }}
            >
              {t.ctaScroll}
              <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="glass px-8 py-4 rounded-full font-semibold hover:glow-cyan transition-all">
              {t.whatsBtn}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Quote Meta ---------- */

function QuoteMeta({
  t, lang, today, validUntil, refNo,
}: { t: typeof translations["en"]; lang: Lang; today: Date; validUntil: Date; refNo: string }) {
  const rows = [
    { label: t.quoteFor, value: t.clientName },
    { label: t.ref, value: refNo },
    { label: t.issued, value: formatDate(today, lang) },
    { label: t.validUntil, value: formatDate(validUntil, lang) },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass rounded-3xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {rows.map((r) => (
          <div key={r.label}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{r.label}</div>
            <div className="text-lg sm:text-xl font-semibold">{r.value}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------- Overview ---------- */

function Overview({ t }: { t: typeof translations["en"] }) {
  return (
    <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <SectionTitle kicker="01" title={t.overviewTitle} />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl"
      >
        {t.overviewLead}
      </motion.p>
    </section>
  );
}

/* ---------- Steps ---------- */

function Steps({ t }: { t: typeof translations["en"] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <SectionTitle kicker="02" title={t.stepsTitle} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass rounded-2xl p-6 hover:glow-cyan transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-primary-foreground"
                style={{ background: "var(--gradient-cyan)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-semibold">{s.t}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Benefits ---------- */

function Benefits({ t }: { t: typeof translations["en"] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <SectionTitle kicker="03" title={t.benefitsTitle} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="relative overflow-hidden rounded-2xl p-6 glass"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl" style={{ background: "oklch(0.7 0.22 210 / 0.25)" }} />
            <div className="relative">
              <div className="text-3xl mb-3">✦</div>
              <h3 className="text-lg font-semibold mb-2">{b.t}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Devices ---------- */

type Item = {
  key: string;
  price: number;
  qty: number;
  image: string;
  data: {
    name: string;
    spec: string;
    why: string;
    features: string[];
    qtyNote?: string;
  };
};

function Devices({ t, items }: { t: typeof translations["en"]; items: Item[] }) {
  const setup = t.items.setup;
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <SectionTitle kicker="04" title={t.devicesTitle} subtitle={t.devicesSub} />
      <div className="space-y-8">
        {items.map((it, i) => (
          <motion.article
            key={it.key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="glass rounded-3xl overflow-hidden grid md:grid-cols-5"
          >
            <div className={`md:col-span-2 relative min-h-[280px] md:min-h-[400px] ${i % 2 === 1 ? "md:order-2" : ""}`}>
              <img src={it.image} alt={it.data.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[oklch(0.09_0.04_260/0.8)]" />
              <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 glass px-3 py-1.5 rounded-full text-xs font-semibold">
                #{String(i + 1).padStart(2, "0")}
              </div>
            </div>
            <div className={`md:col-span-3 p-6 sm:p-10 flex flex-col justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">{it.data.name}</h3>
              <div className="text-cyan text-sm font-medium mb-4">{it.data.spec}</div>
              <p className="text-muted-foreground leading-relaxed mb-6">{it.data.why}</p>
              <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                {it.data.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="text-cyan mt-0.5">◆</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {it.data.qtyNote ?? t.perUnit}
                  </div>
                  <div className="text-4xl font-bold gradient-text">{formatK(it.price)} <span className="text-lg text-muted-foreground font-normal">EGP</span></div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}

        {/* Setup card (no price row) */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl p-8 sm:p-10 relative overflow-hidden"
          style={{ background: "var(--gradient-cyan)" }}
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.15) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative text-primary-foreground max-w-3xl">
            <div className="text-xs uppercase tracking-widest mb-3 opacity-80">Included</div>
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">{setup.name}</h3>
            <p className="text-primary-foreground/90 text-lg leading-relaxed mb-6">{setup.why}</p>
            <div className="flex flex-wrap gap-3">
              {setup.features.map((f) => (
                <span key={f} className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">{f}</span>
              ))}
            </div>
          </div>
        </motion.article>

        <div className="text-center text-sm text-muted-foreground pt-2">✱ {t.importNote}</div>
      </div>
    </section>
  );
}

/* ---------- Price table ---------- */

function PriceTable({
  t, items, subtotal, vat, grand,
}: { t: typeof translations["en"]; items: Item[]; subtotal: number; vat: number; grand: number }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <SectionTitle kicker="05" title={t.priceTitle} subtitle={t.priceSub} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass rounded-3xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-start p-4 sm:p-5 text-xs uppercase tracking-widest text-muted-foreground font-semibold">{t.thItem}</th>
                <th className="text-center p-4 sm:p-5 text-xs uppercase tracking-widest text-muted-foreground font-semibold">{t.thQty}</th>
                <th className="text-end p-4 sm:p-5 text-xs uppercase tracking-widest text-muted-foreground font-semibold">{t.thUnit}</th>
                <th className="text-end p-4 sm:p-5 text-xs uppercase tracking-widest text-muted-foreground font-semibold">{t.thTotal}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.key} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="p-4 sm:p-5">
                    <div className="font-semibold">{it.data.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{it.data.spec}</div>
                  </td>
                  <td className="text-center p-4 sm:p-5 font-mono">{it.qty}</td>
                  <td className="text-end p-4 sm:p-5 font-mono">{formatK(it.price)}</td>
                  <td className="text-end p-4 sm:p-5 font-mono font-semibold">{formatK(it.price * it.qty)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td colSpan={3} className="p-4 sm:p-5 text-end text-muted-foreground">{t.subtotal}</td>
                <td className="p-4 sm:p-5 text-end font-mono font-semibold text-lg">{formatK(subtotal)} EGP</td>
              </tr>
              <tr>
                <td colSpan={3} className="p-4 sm:p-5 text-end text-muted-foreground">{t.vat}</td>
                <td className="p-4 sm:p-5 text-end font-mono font-semibold text-lg">{formatK(Math.round(vat))} EGP</td>
              </tr>
              <tr style={{ background: "var(--gradient-cyan)" }}>
                <td colSpan={3} className="p-5 sm:p-6 text-end font-bold text-primary-foreground text-lg">{t.grandTotal}</td>
                <td className="p-5 sm:p-6 text-end font-mono font-bold text-primary-foreground text-2xl sm:text-3xl">{formatK(Math.round(grand))} EGP</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>
      <div className="text-center text-xs text-muted-foreground mt-4">{t.kNote}</div>
    </section>
  );
}

/* ---------- Validity ---------- */

function Validity({ t, validUntil, lang }: { t: typeof translations["en"]; validUntil: Date; lang: Lang }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="glass rounded-2xl p-6 text-center">
        <div className="text-sm text-muted-foreground">
          ⏳ {t.validityNote} — <span className="text-cyan font-semibold">{formatDate(validUntil, lang)}</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */

function Contact({ t }: { t: typeof translations["en"] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-16 text-center"
        style={{ background: "var(--gradient-cyan)" }}
      >
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 30% 40%, oklch(1 0 0 / 0.2), transparent 40%), radial-gradient(circle at 70% 60%, oklch(0.4 0.2 260 / 0.5), transparent 50%)"
        }} />
        <div className="relative text-primary-foreground">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">{t.contactTitle}</h2>
          <p className="text-lg sm:text-xl opacity-90 mb-10 max-w-2xl mx-auto">{t.contactSub}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={TEL} className="relative inline-flex items-center gap-3 bg-primary-foreground text-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform pulse-ring">
              <span>📞</span> {t.callBtn} · +{PHONE}
            </a>
            <a href="https://wa.me/201002194451" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform">
              <span>💬</span> {t.whatsBtn}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer({ t }: { t: typeof translations["en"] }) {
  return (
    <footer className="border-t border-white/5 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Switches Market" className="h-8 w-auto opacity-80" />
        </div>
        <div className="text-sm text-muted-foreground">{t.footer}</div>
      </div>
    </footer>
  );
}

/* ---------- Floating CTA ---------- */

function FloatingCTA({ t }: { t: typeof translations["en"] }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-4 right-4 rtl:right-auto rtl:left-4 z-50 flex flex-col gap-3"
        >
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label={t.whatsBtn}
             className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform text-2xl relative pulse-ring">
            💬
          </a>
          <a href={TEL} aria-label={t.callBtn}
             className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform text-2xl text-primary-foreground"
             style={{ background: "var(--gradient-cyan)" }}>
            📞
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Section Title ---------- */

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 text-cyan text-xs uppercase tracking-[0.3em] mb-4">
        <span className="w-8 h-px bg-cyan" />
        {kicker}
      </div>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
    </motion.div>
  );
}
