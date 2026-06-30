const AboutHeroBanner = () => {
  return (
    <div className="w-full bg-[#f2fafd] flex justify-center py-10 px-8">
      <div className="max-w-7xl w-full bg-[#e6f7ff] rounded-lg overflow-hidden flex relative shadow-sm" style={{ minHeight: '300px' }}>
        {/* Background Accent (the blue diagonal split) */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00d0ff] transform skew-x-[-20deg] translate-x-20 z-0"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00bfff] transform skew-x-[-20deg] translate-x-32 z-0 opacity-50"></div>

        {/* Content Container */}
        <div className="relative z-10 flex w-full h-full">
          
          {/* Left Text */}
          <div className="w-1/2 flex flex-col justify-center pl-16 py-12">
            <h1 className="text-[#0055c4] font-black text-4xl md:text-5xl uppercase leading-none mb-2">
              ELAMINE,
            </h1>
            <h2 className="text-red-600 font-black text-5xl md:text-6xl uppercase leading-none">
              10 Ans à<br />vos cotés !
            </h2>
          </div>

          {/* Right Image */}
          <div className="w-1/2 flex justify-center items-center p-8">
            <img 
              src="https://placehold.co/400x300/00d0ff/FFF?text=Spray+Bottle" 
              alt="Spray Bottle" 
              className="max-h-full object-contain drop-shadow-xl z-20" 
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AboutHeroBanner;
