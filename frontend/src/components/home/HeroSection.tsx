const HeroSection = () => {
  return (
    <section className="relative w-full bg-[#0055c4] overflow-hidden pt-12 pb-32">
      {/* Wavy Background (Simulated with clip-path) */}
      <div 
        className="absolute bottom-0 left-0 w-full h-32 bg-gray-50"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}
      ></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Product Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
          {/* Main Hero Product Placeholder */}
          <img 
            src="https://placehold.co/300x500/003eb3/FFF?text=Hero+Produit" 
            alt="Hero Product" 
            className="w-64 h-auto drop-shadow-2xl z-10 relative" 
          />
          {/* Splash graphic placeholder */}
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side: Text */}
        <div className="w-full md:w-1/2 text-white mt-12 md:mt-0 md:pl-12 text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-bold italic text-yellow-400 drop-shadow-md mb-2" style={{ fontFamily: 'cursive' }}>
            Fraîcheur
          </h2>
          <h3 className="text-4xl md:text-5xl font-black drop-shadow-md">
            Longue durée
          </h3>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
