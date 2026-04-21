import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ArrowLeft,
  Search,
  Play,
  Film,
  Sparkles,
  Loader2,
  X,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Share2,
  Check,
  Star,
  MessageCircle,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Wind,
  Thermometer,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect } from "react";

// Note: Using Lucide icons instead of Material Symbols for consistency with the rest of the app,
// but keeping the layout and style from the provided HTML.


const PromoVideoGenerator = () => {
  const [status, setStatus] = useState<"idle" | "selecting" | "generating" | "success" | "error">("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const messages = [
    "Настраиваем камеру на гладь Ветлуги...",
    "Ловим лучи закатного солнца...",
    "Добавляем шум весел и пение птиц...",
    "Рендерим заповедные леса...",
    "Почти готово, приключение начинается...",
  ];

  useEffect(() => {
    if (status === "generating") {
      let i = 0;
      const interval = setInterval(() => {
        setLoadingMessage(messages[i % messages.length]);
        i++;
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleGenerate = async () => {
    try {
      // Check if user has selected key
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setStatus("selecting");
        await (window as any).aistudio.openSelectKey();
        // Proceeding assuming success as per guidelines
      }

      setStatus("generating");
      setLoadingMessage(messages[0]);

      const ai = new GoogleGenAI({ apiKey: (process as any).env.API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: 'Cinematic drone shot of a group of kayakers paddling down the Vetluga river in the Russian taiga, lush green forests, golden hour sunlight reflecting off the water, highly detailed nature, adventurous atmosphere.',
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generation failed");

      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': (process as any).env.API_KEY as string,
        },
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        disabled={status === "generating"}
        className="w-full flex items-center justify-center gap-2 border-2 border-primary/20 text-primary py-4 rounded-full font-bold hover:bg-primary/5 transition-colors disabled:opacity-50"
      >
        <Film className="w-5 h-5" />
        {status === "generating" ? "Создаем видео..." : "Посмотреть промо-видео"}
      </motion.button>

      {status !== "idle" && status !== "selecting" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden relative p-8 text-center">
            <button 
              onClick={() => setStatus("idle")}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {status === "generating" && (
              <div className="py-20 flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full"></div>
                  <div className="relative bg-primary text-white p-6 rounded-full">
                    <Loader2 className="w-10 h-10 animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Создаем ваш ролик</h3>
                <p className="text-gray-500 animate-pulse">{loadingMessage}</p>
                <div className="mt-12 text-xs text-gray-400 max-w-sm">
                  Генерация видео Veo может занять до 2-3 минут. Не закрывайте страницу.
                </div>
              </div>
            )}

            {status === "success" && videoUrl && (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="flex items-center justify-center gap-2 text-primary mb-6">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">Готово!</span>
                </div>
                <h3 className="text-3xl font-bold mb-8">Промо Поветлужья</h3>
                <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-8 shadow-2xl">
                  <video src={videoUrl} controls autoPlay className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                        const a = document.createElement('a');
                        a.href = videoUrl;
                        a.download = 'vetluga-promo.mp4';
                        a.click();
                    }}
                    className="flex-1 bg-primary text-white py-4 rounded-full font-bold hover:scale-[1.02] transition-transform"
                  >
                    Скачать
                  </button>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="flex-1 bg-gray-100 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="py-20">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Упс! Произошла ошибка</h3>
                <p className="text-gray-500 mb-8 text-sm max-w-md mx-auto">
                  Не удалось сгенерировать видео. Убедитесь, что ваш API ключ настроен и имеет доступ к Veo (проверьте биллинг).
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold"
                >
                  Попробовать снова
                </motion.button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Vetluga coordinates: 57.8572, 45.1858
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=57.8572&longitude=45.1858&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto");
        const data = await res.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch weather", err);
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (code <= 3) return <CloudSun className="w-8 h-8 text-yellow-400" />;
    if (code <= 48) return <Cloud className="w-8 h-8 text-gray-400" />;
    return <CloudRain className="w-8 h-8 text-primary" />;
  };

  const getWeatherLabel = (code: number) => {
    if (code <= 1) return "Ясно";
    if (code <= 3) return "Переменная облачность";
    if (code <= 48) return "Пасмурно";
    return "Дождь";
  };

  if (loading) return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
    </div>
  );

  if (!weather) return null;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 flex flex-col h-full group overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sun className="w-32 h-32 rotate-12" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center">
          {getWeatherIcon(weather.current.weather_code)}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tracking-tighter">{Math.round(weather.current.temperature_2m)}°C</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{getWeatherLabel(weather.current.weather_code)}</div>
        </div>
      </div>

      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 font-sans text-xs">Прогноз в Ветлуге</h4>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between text-sm py-2 border-b border-black/5">
          <div className="flex items-center gap-3">
            <Wind className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Ветер</span>
          </div>
          <span className="font-bold">{Math.round(weather.current.wind_speed_10m)} км/ч</span>
        </div>
        <div className="flex items-center justify-between text-sm py-2 border-b border-black/5">
          <div className="flex items-center gap-3">
            <Thermometer className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Ощущается как</span>
          </div>
          <span className="font-bold">{Math.round(weather.current.apparent_temperature)}°C</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto">
        {weather.daily.time.slice(1, 4).map((date: string, i: number) => (
          <div key={date} className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-low/50">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              {new Date(date).toLocaleDateString('ru-RU', { weekday: 'short' })}
            </span>
            {getWeatherIcon(weather.daily.weather_code[i+1])}
            <span className="text-sm font-bold mt-2">
              {Math.round(weather.daily.temperature_2m_max[i+1])}°
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const GalleryCarousel = () => {
  const images = [
    { seed: "river", title: "Излучины Ветлуги", color: "bg-[#1b4332]" },
    { seed: "forest", title: "Заповедные боры", color: "bg-[#2d4739]" },
    { seed: "sunset", title: "Золотые закаты", color: "bg-[#8c5a3c]" },
    { seed: "kayak", title: "Маршруты на байдарках", color: "bg-[#005f73]" },
    { seed: "mist", title: "Утренний туман", color: "bg-[#3d5a80]" },
    { seed: "fire", title: "Песни у костра", color: "bg-[#83a95c]" },
    { seed: "beach", title: "Таежные пляжи", color: "bg-[#4a90e2]" },
    { seed: "pines", title: "Вековые сосны", color: "bg-[#22333b]" },
  ];

  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      // Small timeout to ensure DOM is ready and clientRects are stable
      const updateWidth = () => {
        if (carouselRef.current) {
          setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
      };
      
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);

  return (
    <div className="relative">
      <div className="overflow-hidden cursor-grab active:cursor-grabbing pb-12">
        <motion.div 
          ref={carouselRef}
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-6 px-8 md:px-16"
        >
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="min-w-[85vw] md:min-w-[480px] h-[450px] md:h-[640px] rounded-[3rem] overflow-hidden relative group/item"
            >
              <div 
                className={`w-full h-full transition-transform duration-1000 group-hover/item:scale-110 ${img.color}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover/item:opacity-80" />
              <div className="absolute bottom-12 left-12 right-12">
                <h4 className="text-white text-3xl font-display font-bold leading-tight drop-shadow-xl">{img.title}</h4>
                <div className="mt-4 flex items-center justify-between">
                   <div className="w-12 h-1 px-1 rounded-full bg-primary" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Локация #{i+1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Control Buttons - Desktop only */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 z-10">
         <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-none opacity-50">
           <ChevronLeft className="w-6 h-6" />
         </div>
      </div>
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-4 z-10">
         <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-none opacity-50">
           <ChevronRight className="w-6 h-6" />
         </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-primary" : "bg-black/5"}`} />
            ))}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Листайте фотографии</span>
      </div>
    </div>
  );
};


export default function VetlugaPage() {
  const navigate = useNavigate();
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const [isShared, setIsShared] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Сплав по Ветлуге — ннаш гид",
      text: "Присоединяйтесь к нашему приключению на Ветлуге! 15-17 июля 2026. Место встречи: Площадь Ленина.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} Подробнее: ${shareData.url}`);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[870px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-[#1b4332]" />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-8 md:px-16 max-w-7xl mx-auto">
            <div className="inline-flex mb-6">
              <span className="bg-tertiary-container text-on-tertiary-container px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wider">Эко-маршрут</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight mb-8">
              Сплав по Ветлуге <br/> на байдарках
            </h1>
            <div className="flex flex-wrap gap-4 md:gap-12">
              <div className="flex flex-col">
                <span className="text-white/60 text-sm uppercase tracking-widest font-bold">Длительность</span>
                <span className="text-white text-3xl font-display font-bold">3 дня</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/60 text-sm uppercase tracking-widest font-bold">Сложность</span>
                <span className="text-white text-3xl font-display font-bold">Средний уровень</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/60 text-sm uppercase tracking-widest font-bold">Дистанция</span>
                <span className="text-white text-3xl font-display font-bold">45 км пути</span>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="px-8 md:px-16 py-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7">
            <h2 className="text-4xl font-display font-bold mb-8 text-surface-dark">Дикая душа Поветлужья</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Ветлуга — это не просто река, это ожившая легенда Нижегородского края. Протекая сквозь густые таежные леса, она сохранила свою первозданную чистоту и таинственность. Наш маршрут пролегает вдали от шумных трасс, там, где только крик цапли и плеск весла нарушают тишину.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Это путешествие для тех, кто ищет перезагрузки и единения с природой. Песчаные пляжи, высокие обрывистые берега и бесконечное звездное небо над костром — идеальный рецепт настоящего приключения.
            </p>
          </div>
          <div className="md:col-span-5 bg-surface-container-low rounded-xl p-8 sticky top-32">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">kayaking</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase">Снаряжение</p>
                  <p className="text-surface-dark">Байдарки и весла включены</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">local_fire_department</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase">Питание</p>
                  <p className="text-surface-dark">Походная кухня 3 раза в день</p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <div className="text-3xl font-display font-bold text-primary mb-6">14 500 ₽ <span className="text-sm text-gray-500 font-medium">/ человек</span></div>
                <div className="space-y-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-primary text-white py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20"
                  >
                    Забронировать место
                  </motion.button>
                  <PromoVideoGenerator />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="bg-white py-24 overflow-hidden">
          <div className="px-8 md:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-display font-bold mb-16 text-center">Программа приключения</h2>
            
            {/* Scroll indicator for mobile */}
            <div className="flex md:hidden items-center justify-center gap-2 mb-6 text-gray-400">
              <span className="text-[10px] font-bold uppercase tracking-widest">Листайте</span>
              <ArrowRight className="w-3 h-3 animate-pulse" />
            </div>

            <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-12 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-8 px-8 md:mx-0 md:px-0">
              {/* Day 1 */}
              <motion.div 
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group cursor-pointer w-[85vw] md:w-auto md:min-w-0 flex-shrink-0 snap-center"
              >
                <div className="h-64 rounded-xl overflow-hidden mb-6">
                  <div className="w-full h-full bg-[#8c5a3c] transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-5xl font-display font-bold text-secondary/30">01</span>
                  <h3 className="text-xl font-display font-bold">Прибытие и базовый лагерь</h3>
                </div>
                <p className="text-gray-600">Трансфер из Нижнего Новгорода, инструктаж по технике безопасности, установка лагеря и первый ужин у костра под звездным небом.</p>
              </motion.div>

              {/* Day 2 */}
              <motion.div 
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group cursor-pointer w-[85vw] md:w-auto md:min-w-0 flex-shrink-0 snap-center"
              >
                <div className="h-64 rounded-xl overflow-hidden mb-6">
                  <div className="w-full h-full bg-[#2d4739] transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-5xl font-display font-bold text-primary/30">02</span>
                  <h3 className="text-xl font-display font-bold">Основной маршрут</h3>
                </div>
                <p className="text-gray-600">25 км сплава по самому живописному участку реки. Обед на песчаной косе, купание и вечерние истории у костра.</p>
              </motion.div>

              {/* Day 3 */}
              <motion.div 
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group cursor-pointer w-[85vw] md:w-auto md:min-w-0 flex-shrink-0 snap-center"
              >
                <div className="h-64 rounded-xl overflow-hidden mb-6">
                  <div className="w-full h-full bg-[#4a90e2] transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-5xl font-display font-bold text-tertiary/30">03</span>
                  <h3 className="text-xl font-display font-bold">Финишный рывок</h3>
                </div>
                <p className="text-gray-600">Заключительные 10 км пути, прощальный обед и обратный трансфер. Возвращение в город с полным запасом энергии.</p>
              </motion.div>
            </div>

            {/* Mobile Pagination Dots (Visual Only for CSS Scroll) */}
            <div className="flex md:hidden justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-primary" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 overflow-hidden bg-surface-container-low/30">
          <div className="px-8 md:px-16 max-w-7xl mx-auto mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-surface-dark tracking-tight mb-6">Атмосфера Поветлужья</h2>
            <p className="text-lg text-gray-500 font-sans leading-relaxed max-w-2xl">
              Ветлуга — это не только река, но и бесконечные сосновые боры, золотые закаты и туманные утра. Мы собрали моменты, которые ждут вас в этом путешествии.
            </p>
          </div>
          
          <GalleryCarousel />
        </section>

        {/* Map Section */}
        <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
          <div className="bg-surface-container-high rounded-[2.5rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Нить маршрута</h2>
              <p className="text-gray-600 mb-12 text-lg leading-relaxed">Исследуйте детали нашего пути. Маршрут проходит по извилистому руслу реки Ветлуга, огибая заповедные зоны и уникальные природные памятники северной части области.</p>
              <ul className="space-y-6">
                {[
                  { label: "Старт: д. Хахалы", sub: "Сбор группы и спуск на воду", id: 0 },
                  { label: "Малое Широкое", sub: "Первая ночевка и песчаная коса", id: 1 },
                  { label: "Баковское озеро", sub: "Лесные тропы и реликтовые сосны", id: 2 },
                  { label: "Финиш: г. Ветлуга", sub: "Завершение сплава и трансфер", id: 3 }
                ].map((point) => (
                  <li 
                    key={point.id} 
                    className="flex items-start gap-4 group cursor-pointer"
                    onMouseEnter={() => setHoveredMarkerId(point.id)}
                    onMouseLeave={() => setHoveredMarkerId(null)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${hoveredMarkerId === point.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`font-bold text-lg transition-colors ${hoveredMarkerId === point.id ? 'text-primary' : ''}`}>{point.label}</p>
                      <p className="text-sm text-gray-500">{point.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="h-[600px] relative bg-surface-dark/5 overflow-hidden group/map">
              {/* Background Map Placeholder (River Line) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full p-20 overflow-visible" viewBox="0 0 100 100">
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M10,80 Q25,50 35,45 T65,60 T90,30" 
                    fill="none" 
                    stroke="var(--color-primary)" 
                    strokeDasharray="4 4" 
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Interactive Markers */}
              {[
                { x: 10, y: 80, id: 0, title: "д. Хахалы", desc: "Удобный подъезд для машин и пологий берег для спуска байдарок." },
                { x: 35, y: 45, id: 1, title: "Малое Широкое", desc: "Масштабная песчаная коса, идеальное место для купания и отдыха." },
                { x: 65, y: 60, id: 2, title: "Баковское", desc: "Живописный берег с высокими соснами и подготовленной стоянкой." },
                { x: 90, y: 30, id: 3, title: "г. Ветлуга", desc: "Город-порт с богатой историей и удобной точкой финиша." }
              ].map((marker) => (
                <div 
                  key={marker.id}
                  className="absolute z-20"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  onMouseEnter={() => setHoveredMarkerId(marker.id)}
                  onMouseLeave={() => setHoveredMarkerId(null)}
                >
                  <motion.div
                    whileHover={{ scale: 1.5 }}
                    animate={{ 
                      scale: hoveredMarkerId === marker.id ? 1.5 : 1,
                      boxShadow: hoveredMarkerId === marker.id ? "0 0 20px rgba(177, 47, 0, 0.4)" : "0 0 0px rgba(177, 47, 0, 0)"
                    }}
                    className="w-5 h-5 bg-primary rounded-full border-2 border-white cursor-pointer"
                  />
                  
                  <AnimatePresence>
                    {hoveredMarkerId === marker.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 bg-white p-4 rounded-2xl shadow-2xl z-50 pointer-events-none border border-gray-100"
                      >
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{marker.title}</p>
                        <p className="text-xs text-gray-500 leading-tight font-medium">{marker.desc}</p>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              {/* Animated Map Visual Effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Trip Details Section */}
        <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">Детали экспедиции</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-sans">Вся важная информация для подготовки к путешествию в одном месте.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dates Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-surface-container-low rounded-[2rem] p-10 border border-black/5 flex flex-col h-full group transition-all hover:shadow-2xl hover:shadow-black/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 transition-colors group-hover:bg-secondary group-hover:text-white">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold mb-6">Даты и время</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Отправление</span>
                  <span className="font-bold text-surface-dark">15 Июля, 08:00</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Возвращение</span>
                  <span className="font-bold text-surface-dark">17 Июля, 20:00</span>
                </div>
              </div>
              <p className="mt-8 text-sm text-gray-500 leading-relaxed font-sans italic">
                * Убедительная просьба прибыть на место встречи за 20 минут до отправления.
              </p>
            </motion.div>

            {/* Meeting Point Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-surface-container-low rounded-[2rem] p-10 border border-black/5 flex flex-col h-full group transition-all hover:shadow-2xl hover:shadow-black/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 transition-colors group-hover:bg-primary group-hover:text-white">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold mb-6">Место встречи</h3>
              <p className="text-2xl font-bold text-surface-dark mb-4">Площадь Ленина</p>
              <p className="text-gray-500 leading-relaxed font-sans mb-8">
                г. Нижний Новгород, у памятника Ленину. Наш микроавтобус будет припаркован с правой стороны площади.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest py-4 rounded-xl bg-white border border-primary/20 hover:bg-primary hover:text-white transition-all"
              >
                Открыть карту <ExternalLink className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>

            {/* Contact Person Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-surface-container-low rounded-[2rem] p-10 border border-black/5 flex flex-col h-full group transition-all hover:shadow-2xl hover:shadow-black/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-tertiary-container flex items-center justify-center text-tertiary mb-8 transition-colors group-hover:bg-tertiary group-hover:text-white">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold mb-6">Организатор</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">ИП</div>
                <div>
                  <p className="font-bold text-surface-dark">Иван Петров</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Старший гид</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <a href="tel:+79001234567" className="flex items-center gap-4 text-gray-600 hover:text-primary transition-all group/link">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold leading-noneTracking-widest">+7 (900) 123-45-67</span>
                </a>
                <a href="mailto:ivan@navashgid.ru" className="flex items-center gap-4 text-gray-600 hover:text-primary transition-all group/link">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold leading-noneTracking-widest">ivan@navashgid.ru</span>
                </a>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-surface-dark rounded-[2.5rem] p-8 md:p-12 text-white">
            <div>
              <h4 className="text-2xl font-display font-bold mb-4">Погода во время сплава</h4>
              <p className="text-white/60 mb-8 md:mb-0">Мы подготовили актуальный прогноз, чтобы вы могли правильно собрать снаряжение.</p>
            </div>
            <WeatherWidget />
          </div>

          <div className="mt-16 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-3 bg-white border border-black/5 text-surface-dark px-10 py-5 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all group"
            >
              {isShared ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Ссылка скопирована!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                  <span>Поделиться деталями</span>
                </>
              )}
            </motion.button>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto border-t border-black/5">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-surface-dark tracking-tight mb-4">Отзывы участников</h2>
              <p className="text-gray-500 max-w-xl font-sans">Посмотрите, что говорят те, кто уже прошел этот маршрут вместе с нами.</p>
            </div>
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                y: -4,
                boxShadow: "0 25px 50px -12px rgba(177, 47, 0, 0.4)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all group"
            >
              <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Оставить отзыв
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Анна С.",
                rating: 5,
                comment: "Незабываемое путешествие! Ветлуга покорила своей спокойной красотой. Организация на высшем уровне, гиды — профессионалы своего дела.",
                date: "Август 2025"
              },
              {
                name: "Дмитрий М.",
                rating: 4,
                comment: "Отличный маршрут для тех, кто хочет отдохнуть от городской суеты. Природа потрясающая. Один день был дождливым, но это только добавило атмосферы!",
                date: "Июль 2025"
              },
              {
                name: "Елена К.",
                rating: 5,
                comment: "Прекрасный опыт. Походная кухня была на высоте, вечерние посиделки у костра — лучшее завершение дня. Обязательно пойду еще раз.",
                date: "Июнь 2025"
              }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="bg-surface-container-low rounded-3xl p-8 border border-black/5 flex flex-col h-full"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`w-4 h-4 ${idx < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic font-sans mb-8 flex-grow leading-relaxed">
                  "{review.comment}"
                </p>
                <div className="flex items-center justify-between border-t border-black/5 pt-6 mt-auto">
                  <span className="font-bold text-surface-dark">{review.name}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-surface-dark text-white px-6 py-20 mt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div>
              <div className="gropled-text text-2xl uppercase tracking-tighter mb-6 text-white">ннаш гид</div>
              <p className="text-white/40 text-xs max-w-xs leading-relaxed">
                © 2026 ннаш гид. Путеводитель по экотропам Нижегородской области. Некоммерческий проект.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[10px] font-bold uppercase tracking-widest text-white/60">
              <div className="flex flex-col gap-4">
                <span className="text-white mb-2">Навигация</span>
                <motion.button whileHover={{ x: 3 }} onClick={() => navigate("/")} className="text-left hover:text-white transition-colors">Маршруты</motion.button>
                <motion.a whileHover={{ x: 3 }} href="#" className="hover:text-white transition-colors">Места</motion.a>
                <motion.a whileHover={{ x: 3 }} href="#" className="hover:text-white transition-colors">Карта</motion.a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-white mb-2">Инфо</span>
                <motion.a whileHover={{ x: 3 }} href="#" className="hover:text-white transition-colors">О нас</motion.a>
                <motion.a whileHover={{ x: 3 }} href="#" className="hover:text-white transition-colors">Блог</motion.a>
                <motion.a whileHover={{ x: 3 }} href="#" className="hover:text-white transition-colors">FAQ</motion.a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-white mb-2">Правовая информация</span>
                <motion.a whileHover={{ x: 3 }} href="#" className="hover:text-white transition-colors">Политика КФ</motion.a>
                <motion.a whileHover={{ x: 3 }} href="#" className="hover:text-white transition-colors">Контакты</motion.a>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Сделано с любовью к природе Поволжья
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
