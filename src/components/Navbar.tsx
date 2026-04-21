import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, User, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Маршруты", path: "/" },
    { name: "Места", path: "/#featured" },
    { name: "Проекты", path: "#" },
    { name: "О нас", path: "#" },
  ];

  const handleLinkClick = (path: string) => {
    if (path.startsWith("/#")) {
      const id = path.split("#")[1];
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(path);
      }
    } else if (path.startsWith("/")) {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  const isVetluga = location.pathname === "/vetluga";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled || isMobileMenuOpen 
          ? "bg-white/95 backdrop-blur-md py-4 shadow-lg shadow-black/[0.03] border-b border-gray-100/50" 
          : isVetluga 
            ? "bg-transparent py-6" 
            : "bg-white/40 backdrop-blur-md py-6 border-b border-gray-200/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`gropled-text text-xl uppercase tracking-tighter cursor-pointer transition-colors duration-500 ${
              !isScrolled && isVetluga ? "text-white" : "text-black"
            }`}
            onClick={() => navigate("/")}
          >
            ннаш гид
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = link.path === location.pathname;
              return (
                <motion.button
                  key={link.name}
                  whileHover={{ y: -1 }}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative py-1 ${
                    !isScrolled && isVetluga 
                      ? "text-white/70 hover:text-white" 
                      : "text-gray-500 hover:text-primary"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.03)" }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${
                !isScrolled && isVetluga ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-primary"
              }`}
            >
              <Search className="w-4.5 h-4.5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.03)" }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${
                !isScrolled && isVetluga ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-primary"
              }`}
            >
              <User className="w-4.5 h-4.5" />
            </motion.button>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05, y: -1 }} 
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] shadow-xl shadow-primary/20 hidden sm:block"
          >
            Поехать
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button 
            className={`md:hidden p-2 transition-colors duration-500 ${
              !isScrolled && isVetluga && !isMobileMenuOpen ? "text-white" : "text-black"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden shadow-2xl absolute top-full left-0 right-0 h-screen"
          >
            <div className="px-8 py-12 flex flex-col gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.path)}
                  className="text-left text-lg font-display font-medium tracking-tight text-gray-900 border-b border-gray-50 pb-4"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-8 flex flex-col gap-6">
                <div className="flex items-center gap-4 text-gray-500">
                  <Search className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">Поиск</span>
                </div>
                <div className="flex items-center gap-4 text-gray-500">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">Профиль</span>
                </div>
                <button className="bg-primary text-white px-8 py-5 rounded-full text-sm font-bold uppercase tracking-[0.2em] w-full shadow-xl shadow-primary/20 mt-4">
                  Запланировать поездку
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
