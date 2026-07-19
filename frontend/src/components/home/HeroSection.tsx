import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { banners } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter only active banners and sort by position
  const activeBanners = banners
    .filter((b) => b.status === 'Actif')
    .sort((a, b) => a.position - b.position);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    // Fallback if no banners are configured
    return (
      <section
        className="relative w-full overflow-hidden pt-8 pb-32"
        style={{ background: 'radial-gradient(circle at 25% 20%, #0098FF 0%, #005BB5 100%)' }}
      >
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: '18rem' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0,10 C40,5 70,100 100,100 L100,100 L0,100 Z" fill="#f9fafb" />
        </svg>

        <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative md:translate-y-8">
            <img
              src="/images/Group.png"
              alt="Feather"
              className="absolute z-0 w-[300px] md:w-[540px] max-w-[90%] md:max-w-[85%] left-0 bottom-0"
            />
            <img
              src="/images/AlaminePro.png"
              alt="Hero Product"
              className="w-72 h-auto drop-shadow-2xl z-10 relative"
            />
          </div>
          <div className="w-full md:w-1/2 text-white mt-12 md:mt-0 md:pl-12 text-center md:text-left">
            <h2 className="text-4xl md:text-7xl font-bold italic text-yellow-400 drop-shadow-md mb-2" style={{ fontFamily: 'cursive' }}>
              Fraîcheur
            </h2>
            <h3 className="text-3xl md:text-5xl font-black drop-shadow-md">
              Longue durée
            </h3>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden h-[450px] md:h-[550px] bg-slate-100">
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {banner.targetUrl ? (
            <Link to={banner.targetUrl} className="block w-full h-full">
              <img
                src={banner.imageUrl ? `http://localhost:8081${banner.imageUrl}` : '/images/placeholder.jpg'}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (banner.imageUrl && !banner.imageUrl.startsWith('http')) {
                    (e.target as HTMLImageElement).src = banner.imageUrl;
                  }
                }}
              />
            </Link>
          ) : (
            <img
              src={banner.imageUrl ? `http://localhost:8081${banner.imageUrl}` : '/images/placeholder.jpg'}
              alt={banner.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (banner.imageUrl && !banner.imageUrl.startsWith('http')) {
                  (e.target as HTMLImageElement).src = banner.imageUrl;
                }
              }}
            />
          )}
          
          {/* Optional Title Overlay */}
          {banner.title && banner.title !== 'Sans titre' && (
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 md:p-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                {banner.title}
              </h2>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Aller à la bannière ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
