/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import VetlugaPage from "./VetlugaPage";
import { Navbar } from "./components/Navbar";
import { generateItinerary, GeneratedItinerary } from "./services/itineraryService";
import { 
  ArrowRight, 
  ArrowDown, 
  Eye, 
  Instagram, 
  Send, 
  Menu,
  ChevronRight,
  Leaf,
  Map,
  Compass,
  Zap,
  Navigation,
  Waves,
  X,
  ArrowUp,
  Loader2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  Share2,
  Check,
  Tag,
  Mountain
} from "lucide-react";

const JoinProjectModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-gray-400 hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-tertiary-container text-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-display mb-4">Заявка принята!</h3>
                <p className="text-gray-500">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-display mb-2">Стать частью проекта</h3>
                <p className="text-gray-500 mb-8">Заполните анкету, и мы пригласим вас в наше следующее приключение.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Фамилия</label>
                      <input required type="text" placeholder="Иванов" className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Имя</label>
                      <input required type="text" placeholder="Иван" className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Отчество</label>
                    <input type="text" placeholder="Иванович" className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Почта</label>
                      <input required type="email" placeholder="example@mail.ru" className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Номер телефона</label>
                      <input required type="tel" placeholder="+7 (999) 000-00-00" className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Даты путешествия</label>
                    <input required type="text" placeholder="Например: 15-20 июля" className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                  </div>

                  <button type="submit" className="w-full bg-primary text-white py-5 rounded-full font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform mt-4 shadow-xl shadow-primary/20">
                    Отправить заявку
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ItineraryGeneratorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [days, setDays] = useState(3);
  const [activityType, setActivityType] = useState("смешанный");
  const [difficulty, setDifficulty] = useState("средний");
  const [interests, setInterests] = useState<string[]>([]);
  const [result, setResult] = useState<GeneratedItinerary | null>(null);
  const [progress, setProgress] = useState(0);
  const [isShared, setIsShared] = useState(false);

  const interestOptions = ["Природа", "Архитектура", "История", "Гастрономия", "Местный колорит", "Спорт", "Фотография"];

  const handleGenerate = async () => {
    setStep("loading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 5 : prev));
    }, 400);

    try {
      const data = await generateItinerary({
        days,
        activityType,
        interests: interests.length > 0 ? interests : ["природа"],
        difficulty
      });
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setResult(data);
        setStep("result");
      }, 500);
    } catch (error) {
      clearInterval(interval);
      console.error(error);
      setStep("form");
    }
  };

  const handleShare = () => {
    if (result) {
      const text = `Мой идеальный маршрут: ${result.name} (${result.vibe}). Создано в ннаш гид.`;
      navigator.clipboard.writeText(text);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-gray-400 hover:text-primary transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {step === "form" && (
              <div className="animate-in fade-in duration-500">
                <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles className="w-4 h-4" />
                  AI Генератор
                </div>
                <h3 className="text-4xl font-display mb-4">Создайте свой идеальный маршрут</h3>
                <p className="text-gray-500 mb-10">Наш AI помощник подберет для вас лучшие места и активности в Нижегородской области.</p>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Количество дней: {days}</label>
                    <input 
                      type="range" min="1" max="7" value={days} 
                      onChange={(e) => setDays(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" 
                    />
                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                      <span>1 ДЕНЬ</span>
                      <span>7 ДНЕЙ</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Тип активности</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Пеший", "Водный", "Смешанный"].map(type => (
                        <button
                          key={type}
                          onClick={() => setActivityType(type.toLowerCase())}
                          className={`py-4 rounded-2xl text-xs font-bold transition-all border-2 ${
                            activityType === type.toLowerCase() 
                              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                              : "bg-surface-container-low border-transparent text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Сложность</label>
                    <div className="flex gap-3">
                      {["Легкий", "Средний", "Сложный"].map(level => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level.toLowerCase())}
                          className={`flex-1 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all border-2 ${
                            difficulty === level.toLowerCase() 
                              ? "bg-secondary border-secondary text-white shadow-lg" 
                              : "bg-surface-container-low border-transparent text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Ваши интересы</label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map(interest => (
                        <button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                            interests.includes(interest)
                              ? "bg-secondary text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    className="w-full bg-primary text-white py-6 rounded-full font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                    Генерация маршрута
                  </button>
                </div>
              </div>
            )}

            {step === "loading" && (
              <div className="py-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-10">
                  <Sparkles className="w-10 h-10 animate-pulse" />
                </div>
                
                <h3 className="text-3xl font-display mb-2">Создаем маршрут...</h3>
                <p className="text-gray-500 max-w-sm mb-12">Наш интеллект анализирует сотни локаций для вашего идеального отдыха.</p>
                
                <div className="w-full max-w-md bg-gray-100 h-3 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 50 }}
                    className="absolute inset-y-0 left-0 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] shadow-primary/40"
                  />
                </div>
                
                <div className="mt-4 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {Math.round(progress)}% Загрузка
                  </span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1 h-1 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === "result" && result && (
              <div className="animate-in slide-in-from-bottom-10 fade-in duration-700">
                <div className="flex justify-between items-start mb-6">
                  <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                    <Map className="w-4 h-4" />
                    Ваш уникальный план
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Mountain className="w-3 h-3" />
                    {result.difficulty}
                  </div>
                </div>
                
                <h3 className="text-4xl font-display mb-2 text-surface-dark">{result.name}</h3>
                <p className="text-secondary italic mb-10 text-lg">{result.vibe}</p>

                <div className="space-y-10 mb-12">
                  {result.items.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-6 relative"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-[1.25rem] bg-primary/5 flex items-center justify-center text-primary font-display text-xl font-bold shadow-sm border border-primary/10">
                          {item.day}
                        </div>
                        {idx !== result.items.length - 1 && (
                          <div className="w-[2px] flex-grow bg-gray-100 rounded-full my-1" />
                        )}
                      </div>
                      <div className="flex-grow pb-4">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 px-2 py-1 bg-primary/5 rounded-md">
                            <MapPin className="w-3 h-3" /> {item.location}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {item.activityType}
                          </span>
                        </div>
                        <h4 className="text-2xl font-display font-bold mb-3 text-surface-dark">{item.title}</h4>
                        <p className="text-gray-500 leading-relaxed mb-4">{item.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags?.map(tag => (
                            <span key={tag} className="text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1 bg-gray-50 text-gray-400 border border-black/5 rounded-full flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setStep("form")}
                    className="py-5 rounded-full border border-black/5 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Попробовать еще раз
                  </button>
                  <button 
                    onClick={handleShare}
                    className="bg-primary text-white py-5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group transition-all active:scale-95"
                  >
                    {isShared ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span>Поделиться</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const HowItWorks = ({ onStartClick }: { onStartClick: () => void }) => (
  <section id="how-it-works" className="px-6 py-24 bg-white">
    <div className="max-w-7xl mx-auto w-full">
      <h2 className="text-4xl md:text-5xl font-display mb-16 text-center">Как это работает</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-gray-50 transition-colors"
        >
          <div className="w-16 h-16 bg-secondary-light rounded-2xl flex items-center justify-center text-secondary mb-6">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-4">Выбери направление</h3>
          <p className="text-gray-500 text-sm">
            Лёгкие тропы, сплавы, пещеры и птичьи луга — всё в одном месте.
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-gray-50 transition-colors"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Map className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-4">Настрой маршрут</h3>
          <p className="text-gray-500 text-sm">
            Укажи количество дней, тип активности и свои интересы.
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-gray-50 transition-colors"
        >
          <div className="w-16 h-16 bg-tertiary-container rounded-2xl flex items-center justify-center text-tertiary mb-6">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-4">Поехали</h3>
          <p className="text-gray-500 text-sm mb-6">
            Получай маршрут, сохраняй план и готовься к путешествию.
          </p>
          <button 
            onClick={onStartClick}
            className="mt-auto px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all transform hover:scale-105"
          >
            Начать сейчас
          </button>
        </motion.div>
      </div>
    </div>
  </section>
);

const PopularPlaces = () => (
  <section className="px-6 py-24 max-w-7xl mx-auto w-full">
    <div className="flex items-center justify-between mb-16">
      <h2 className="text-4xl md:text-5xl font-display">Популярные места</h2>
      <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
        <Navigation className="w-6 h-6" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <motion.div whileHover={{ y: -10 }} className="group">
        <div className="h-64 rounded-3xl overflow-hidden mb-6">
          <div className="w-full h-full bg-[#1e3a2f] transition-transform duration-700 group-hover:scale-110" />
        </div>
        <h3 className="text-xl font-bold mb-2">Керженский заповедник</h3>
        <p className="text-gray-500 text-sm">
          Сосновые боры, болота и реки с официальными гидами.
        </p>
      </motion.div>
      <motion.div whileHover={{ y: -10 }} className="group">
        <div className="h-64 rounded-3xl overflow-hidden mb-6">
          <div className="w-full h-full bg-[#3d5a80] transition-transform duration-700 group-hover:scale-110" />
        </div>
        <h3 className="text-xl font-bold mb-2">Пустынский заказник</h3>
        <p className="text-gray-500 text-sm">
          Карстовые озёра и реликтовые леса на юге области.
        </p>
      </motion.div>
      <motion.div whileHover={{ y: -10 }} className="group">
        <div className="h-64 rounded-3xl overflow-hidden mb-6">
          <div className="w-full h-full bg-[#83a95c] transition-transform duration-700 group-hover:scale-110" />
        </div>
        <h3 className="text-xl font-bold mb-2">Артемовские луга</h3>
        <p className="text-gray-500 text-sm">
          Более 80% птиц региона, кемпинг и береговая зона Волжской поймы.
        </p>
      </motion.div>
    </div>
  </section>
);

const Hero = ({ onStartClick }: { onStartClick: () => void }) => {
  const scrollToContent = () => {
    const element = document.getElementById("how-it-works");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="px-6 pt-12 pb-24 max-w-7xl mx-auto w-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl leading-[0.9] mb-8"
          >
            Открываем <br />
            <span className="text-secondary italic">заповедную природу</span> <br />
            Нижнего Новгорода
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl max-w-2xl mb-12"
          >
            Платформа для осознанных путешествий, маршрутов и событий в Нижегородской области. Легко выбрать эко-маршрут, найти места и познакомиться с гидами.
          </motion.p>
          <div className="flex flex-wrap gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={onStartClick}
              className="bg-primary text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              Составить маршрут
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.02)" }} 
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 rounded-full border border-gray-200 font-bold uppercase tracking-widest transition-colors"
            >
              Все места
            </motion.button>
          </div>
        </div>
      </div>
      
      <motion.button 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={scrollToContent}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 border border-primary rounded-full items-center justify-center text-primary hover:bg-primary hover:text-white transition-all group"
      >
        <ArrowDown className="group-hover:translate-y-1 transition-transform" />
      </motion.button>
    </section>
  );
};

const FeaturedGrid = () => (
  <section id="featured" className="px-6 py-12 max-w-7xl mx-auto w-full">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Large Image Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="md:col-span-7 relative h-[500px] rounded-3xl overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[#2d4739] transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-10 left-10 right-10">
          <h3 className="text-white text-3xl mb-6 max-w-xs">Секретные тропы Керженского заповедника</h3>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Исследовать
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="md:col-span-5 relative rounded-3xl p-12 flex flex-col justify-between overflow-hidden group"
      >
        <div className="absolute inset-0 bg-primary transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="relative z-10 flex justify-between items-start">
          <Leaf className="text-white w-8 h-8" />
          <span className="text-white text-6xl font-display">15+</span>
        </div>
        <div className="relative z-10">
          <h3 className="text-white text-3xl mb-4 leading-tight">эко-маршрутов на этот сезон</h3>
          <p className="text-white/80 text-sm max-w-xs">
            От пеших прогулок по борам до водных экспедиций.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

const CultureBanner = ({ onJoinClick }: { onJoinClick: () => void }) => (
  <section className="px-6 py-12 max-w-7xl mx-auto w-full">
    <div className="bg-primary rounded-3xl p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-8">
      <h2 className="text-white text-4xl md:text-5xl max-w-2xl leading-tight">
        Мы создаем культуру осознанных путешествий по родному краю.
      </h2>
      <motion.button 
        whileHover={{ scale: 1.1, y: "-40%" }}
        whileTap={{ scale: 0.9 }}
        onClick={onJoinClick}
        className="bg-white text-primary px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest whitespace-nowrap"
      >
        Стать частью проекта
      </motion.button>
    </div>
  </section>
);

const PopularRoutes = () => {
  const navigate = useNavigate();
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl capitalize tracking-tight">Популярные направления</h2>
        <motion.a 
          whileHover={{ x: 5 }}
          href="#" 
          className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest group"
        >
          Все направления <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Pink Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-3 bg-[#fde8e8] rounded-3xl p-8 flex flex-col justify-between h-[500px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <div className="w-12 h-12 rounded-full border-4 border-white/30" />
          </div>
          <div>
            <span className="bg-white/50 text-primary px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">Новое</span>
            <h3 className="text-primary text-2xl leading-tight">Наблюдение за редкими птицами</h3>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center transition-transform"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Large Image Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-6 relative h-[500px] rounded-3xl overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[#005f73] transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-10 left-10">
            <h3 className="text-white text-3xl mb-2">Высокий берег Волги</h3>
            <p className="text-white/70 text-sm">Панорамные виды на 360 градусов</p>
          </div>
        </motion.div>

        {/* Purple Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          onClick={() => navigate("/vetluga")}
          className="md:col-span-3 bg-secondary rounded-3xl p-8 flex flex-col justify-between h-[500px] text-white cursor-pointer"
        >
          <div>
            <Waves className="mb-6 w-8 h-8" />
            <h3 className="text-2xl leading-tight">Сплавы по Ветлуге на байдарках</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">3 дня</span>
            <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center">
              <ArrowRight className="w-4 h-4 -rotate-45" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-surface-dark text-white px-6 py-20 mt-20">
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
        <div>
          <div className="gropled-text text-2xl uppercase tracking-tighter mb-6">ннаш гид</div>
          <p className="text-white/40 text-xs max-w-xs leading-relaxed">
            © 2026 ннаш гид. Путеводитель по экотропам Нижегородской области. Некоммерческий проект.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[10px] font-bold uppercase tracking-widest text-white/60">
          <div className="flex flex-col gap-4">
            <span className="text-white mb-2">Навигация</span>
            <a href="#" className="hover:text-white transition-colors">Маршруты</a>
            <a href="#" className="hover:text-white transition-colors">Места</a>
            <a href="#" className="hover:text-white transition-colors">Карта</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white mb-2">Инфо</span>
            <a href="#" className="hover:text-white transition-colors">О нас</a>
            <a href="#" className="hover:text-white transition-colors">Блог</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white mb-2">Правовая информация</span>
            <a href="#" className="hover:text-white transition-colors">Политика КФ</a>
            <a href="#" className="hover:text-white transition-colors">Контакты</a>
          </div>
        </div>
      </div>
      
      <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
          >
            <Instagram className="w-4 h-4" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          Сделано с любовью к природе Поволжья
        </div>
      </div>
    </div>
  </footer>
);

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  return (
    <main className="pt-20 flex-grow">
      <Hero onStartClick={() => setIsGeneratorOpen(true)} />
      <FeaturedGrid />
      <HowItWorks onStartClick={() => setIsGeneratorOpen(true)} />
      <CultureBanner onJoinClick={() => setIsModalOpen(true)} />
      <PopularPlaces />
      <PopularRoutes />
      <JoinProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ItineraryGeneratorModal isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} />
    </main>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-10 right-10 z-[90] w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl transition-transform"
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <HomePage />
              <Footer />
              <ScrollToTop />
            </>
          } />
          <Route path="/vetluga" element={<VetlugaPage />} />
        </Routes>
      </div>
    </Router>
  );
}
