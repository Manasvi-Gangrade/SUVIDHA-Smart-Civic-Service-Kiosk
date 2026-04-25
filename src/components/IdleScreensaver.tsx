import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Info, Clock, TrendingUp, Radio } from 'lucide-react';

export const IdleScreensaver = () => {
  const [isIdle, setIsIdle] = useState(false);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (isIdle) setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsIdle(true);
        navigate('/');
      }, 45000); 
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'touchmove', 'scroll', 'click'];
    events.forEach(e => document.addEventListener(e, resetTimer, true));
    resetTimer();

    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(timeInterval);
      events.forEach(e => document.removeEventListener(e, resetTimer, true));
    };
  }, [navigate, isIdle]);

  if (!isIdle) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#0f172a] cursor-pointer flex flex-col overflow-hidden animate-in fade-in duration-1000"
      onClick={() => setIsIdle(false)}
    >
      {/* Background Video (Live News Vibe) */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
        src="/@fs/c:/Users/MANASVI/OneDrive/Desktop/Projects/SUVIDHA-Smart-Civic-Service-Kiosk/videos/14904045_3840_2160_30fps.mp4" 
      />
      
      {/* News Overlay UI */}
      <div className="relative z-10 flex-1 flex flex-col p-12">
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-4 bg-red-600 px-6 py-2 rounded-lg shadow-xl shadow-red-500/20">
              <Radio className="h-6 w-6 text-white animate-pulse" />
              <span className="text-xl font-black text-white tracking-widest">LIVE UPDATES</span>
           </div>
           <div className="text-right text-white">
              <div className="text-6xl font-black tracking-tighter">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-xl font-bold opacity-60 uppercase tracking-widest">{currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</div>
           </div>
        </div>

        <div className="mt-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "New Connection Drive", desc: "Electricity department starts weekly camps at Sector 4 and 12.", icon: TrendingUp },
             { title: "Water Line Repair", desc: "Scheduled maintenance in Zoo Road complete. Normal supply resumes.", icon: Info },
             { title: "Smart City Update", desc: "New waste tracking sensors installed in downtown clusters.", icon: Newspaper },
           ].map((news, i) => (
             <div key={i} className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:bg-white/20 transition-all">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                   <news.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{news.title}</h3>
                <p className="text-white/60 font-medium leading-relaxed">{news.desc}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="relative z-10 bg-red-600 py-4 border-y border-white/10">
         <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
            {[1,2,3,4].map(i => (
              <span key={i} className="text-white font-black text-xl tracking-widest uppercase">
                • SUVIDHA Kiosk is now live in 45 centers across the city • Instant Aadhaar-based document verification now available • Pay taxes before May 31 to get 10% rebate
              </span>
            ))}
         </div>
      </div>

      <div className="relative z-10 bg-black/60 backdrop-blur-md py-10 flex flex-col items-center justify-center">
         <p className="text-2xl text-white font-black tracking-[0.4em] animate-bounce">TOUCH SCREEN TO START</p>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
