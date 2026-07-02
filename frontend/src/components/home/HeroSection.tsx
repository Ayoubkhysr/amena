const HeroSection = () => {
  return (
    <section
      className="relative w-full overflow-hidden pt-8 pb-32"
      style={{ background: 'radial-gradient(circle at 25% 20%, #0098FF 0%, #005BB5 100%)' }}
    >
      {/* Wavy Background (smooth curve, keeps a bit of blue visible on the left edge) */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '18rem' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M0,10 C40,5 70,100 100,100 L100,100 L0,100 Z" fill="#f9fafb" />
      </svg>

      <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Product Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative md:translate-y-8">
          {/* Feather graphic, resting behind/beside the bottle's base */}
          <img
            src="/images/Group.png"
            alt="Feather"
            className="absolute z-0"
            style={{
              width: '540px',
              height: '314px',
              maxWidth: '85%',
              left: '0%',
              bottom: '0%',
            }}
          />
          {/* Main Hero Product Placeholder */}
          <img
            src="/images/AlaminePro.png"
            alt="Hero Product"
            className="w-72 h-auto drop-shadow-2xl z-10 relative"
          />
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
