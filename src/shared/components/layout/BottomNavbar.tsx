import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Trophy,
  Menu,
} from "lucide-react";
import { useI18n } from "@/shared/context/i18n";
import { useUIStore } from "@/shared/store/useUIStore";
import { useAuthStore } from "@/features/auth";

const BottomNavbar: React.FC = () => {
  const location = useLocation();
  const { t } = useI18n();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useUIStore();
  const { user } = useAuthStore();

  if (!user) return null;

  const navLinks = [
    { path: "/", label: "Home", icon: LayoutDashboard },
    { path: "/entrenar", label: t("nav.train") || "Gym", icon: PlusCircle },
    { path: "/historial", label: t("nav.history") || "History", icon: History },
    { path: "/marcas", label: t("nav.records") || "Bench", icon: Trophy },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-(--card)/80 backdrop-blur-xl border-t border-(--border) px-2 pb-safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative ${
                active ? "text-(--primary)" : "text-(--muted-text)"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-transform duration-200 ${active ? "scale-110" : "scale-100"}`}
              >
                <Icon
                  className={`w-6 h-6 ${active ? "fill-(--primary)/10" : ""}`}
                />
              </div>
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
                {link.label.split(" ")[0]}
              </span>
              {active && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-[2px] bg-(--primary) rounded-full shadow-[0_0_8px_var(--primary)]" />
              )}
            </Link>
          );
        })}

        {/* Menu button to trigger the same drawer as the top navbar */}
        {/* <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
            isMobileMenuOpen ? "text-(--primary)" : "text-(--muted-text)"
          }`}
        >
          <div className={`p-1 rounded-xl transition-transform duration-200 ${isMobileMenuOpen ? "scale-110" : "scale-100"}`}>
            <Menu className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
            Menu
          </span>
          {isMobileMenuOpen && (
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-[2px] bg-(--primary) rounded-full shadow-[0_0_8px_var(--primary)]" />
          )}
        </button> */}
      </div>
    </nav>
  );
};

export default BottomNavbar;
