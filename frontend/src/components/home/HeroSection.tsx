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

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '/images/placeholder.jpg';
    if (url.startsWith('http')) return url;
    return url;
  };

  if (activeBanners.length === 0) {
    return <div className="w-full bg-white py-8"></div>;
  }

  return (
    <section className="relative w-full overflow-hidden bg-slate-100">
      {/* Invisible placeholder to define the section's height based on the first image's aspect ratio */}
      {activeBanners[0] && (
        <img
          src={resolveImageUrl(activeBanners[0].imageUrl)}
          className="w-full h-auto invisible block"
          alt="placeholder"
        />
      )}
      
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
                src={resolveImageUrl(banner.imageUrl)}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </Link>
          ) : (
            <img
              src={resolveImageUrl(banner.imageUrl)}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          )}
          
          {banner.title && banner.title !== 'Sans titre' && (
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6 md:p-16">
              <h2 className="text-2xl md:text-5xl font-bold text-white drop-shadow-lg">
                {banner.title}
              </h2>
            </div>
          )}
        </div>
      ))}

      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`min-w-4 min-h-4 md:min-w-5 md:min-h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Aller à la bannière ${index + 1}`}
            >
              <span className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
