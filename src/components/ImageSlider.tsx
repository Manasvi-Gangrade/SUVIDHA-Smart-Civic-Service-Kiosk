import { useState, useEffect } from 'react';

const images = [
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1200&auto=format&fit=crop", // City skyline
  "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=1200&auto=format&fit=crop", // Smart tech
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1200&auto=format&fit=crop", // Modern city
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop"  // Digital connection
];

export const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/20 group">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`City Slide ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        />
      ))}
      
      {/* Dynamic Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-500 shadow-lg ${
              index === currentIndex ? 'w-10 bg-primary' : 'w-3 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Corner Badge */}
      <div className="absolute top-6 left-6 z-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
         <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Feed</p>
      </div>
    </div>
  );
};
