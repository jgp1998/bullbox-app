import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Trophy, 
  Scale, 
  Calculator, 
  LogOut, 
  User,
  Settings
} from "lucide-react";
import { themes } from "@/shared/constants";
import { useI18n } from "@/shared/context/i18n";
import { useUIStore } from "@/shared/store/useUIStore";
import { useAuthStore } from "@/features/auth";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage } = useI18n();
  const { theme, setTheme } = useUIStore();
  const { user, logout, isLoading } = useAuthStore();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  if (!user && !isLoading) return null;

  const navLinks = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/entrenar", label: t('nav.train') || "Entrenar", icon: PlusCircle },
    { path: "/historial", label: t('nav.history') || "Historial", icon: History },
    { path: "/marcas", label: t('nav.records') || "Marcas", icon: Trophy },
    { path: "/conversor", label: t('nav.converter') || "Conversor", icon: Scale },
    { path: "/calculadora", label: t('nav.calculator') || "Calculadora", icon: Calculator },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--card)/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-(--primary) tracking-tighter uppercase italic drop-shadow-sm select-none">
                  BULL<span className="text-(--text)">BOX</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive(link.path)
                        ? "bg-(--primary) text-white shadow-lg shadow-(--primary)/20"
                        : "text-(--muted-text) hover:bg-(--input) hover:text-(--text)"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center space-x-3 ml-4">
              <div className="flex items-center space-x-2 bg-(--input) px-2 py-1 rounded-2xl border border-(--border)">
                  <Input 
                      id="lang-desktop"
                      type="select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                      options={[
                          { value: 'en', label: 'EN' },
                          { value: 'es', label: 'ES' }
                      ]}
                      className="w-16 h-8 text-xs border-none bg-transparent"
                  />
                  <Input 
                      id="theme-desktop"
                      type="select"
                      value={theme.name}
                      onChange={(e) => {
                          const newTheme = themes.find(t => t.name === e.target.value);
                          if (newTheme) setTheme(newTheme);
                      }}
                      options={themes.map(t => ({ value: t.name, label: t.name.toUpperCase() }))}
                      className="w-24 h-8 text-xs border-none bg-transparent"
                  />
              </div>
              
              <Button
                onClick={() => logout()}
                variant="outline"
                size="sm"
                className="rounded-xl border-(--border) hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-(--text) hover:bg-(--input) transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay & Drawer - Now outside nav to fix stacking and filters */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[100] ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`} 
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer */}
        <div 
          className={`fixed right-0 top-0 h-full w-4/5 max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col p-6 z-[110] transform transition-transform duration-300 ease-out border-l border-(--border) ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ 
            backgroundColor: theme.colors['--background'] || '#1a1a1a',
            opacity: 1 
          }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-(--text) tracking-tighter italic">MENU</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-(--input) text-(--text) hover:bg-(--primary) hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center p-4 rounded-2xl text-base font-bold transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-(--primary) text-white shadow-xl shadow-(--primary)/30 scale-[1.02]"
                      : "text-(--muted-text) hover:bg-(--input) hover:text-(--text) hover:translate-x-1"
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 ${isActive(link.path) ? "bg-white/20" : "bg-(--input)"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto space-y-6 pt-6 border-t border-(--border)">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-(--muted-text) uppercase tracking-wider ml-1">Idioma</label>
                <Input 
                    id="lang-mobile"
                    type="select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                    options={[
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Español' }
                    ]}
                    className="h-12 text-sm rounded-2xl bg-(--input) border-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-(--muted-text) uppercase tracking-wider ml-1">Tema</label>
                <Input 
                    id="theme-mobile"
                    type="select"
                    value={theme.name}
                    onChange={(e) => {
                        const newTheme = themes.find(t => t.name === e.target.value);
                        if (newTheme) setTheme(newTheme);
                    }}
                    options={themes.map(t => ({ value: t.name, label: t.name.split(' ')[0] }))}
                    className="h-12 text-sm rounded-2xl bg-(--input) border-none font-bold"
                />
              </div>
            </div>

            <Button
              onClick={() => logout()}
              variant="primary"
              className="w-full flex items-center justify-center py-5 rounded-2xl font-black bg-red-500 hover:bg-red-600 border-none shadow-xl shadow-red-500/30 text-white uppercase tracking-wider italic animate-in"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {t('header.logout') || "Cerrar Sesión"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
