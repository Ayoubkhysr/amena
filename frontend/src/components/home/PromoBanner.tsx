const PromoBanner = () => {
  return (
    <section className="w-full py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="w-full bg-[#002878] rounded-2xl overflow-hidden flex flex-col md:flex-row items-center relative shadow-2xl">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 h-64 md:h-80 relative">
             <img 
               src="https://placehold.co/600x400/003eb3/FFF?text=Warehouse+Workers" 
               alt="SuperPRO Promotion" 
               className="w-full h-full object-cover" 
             />
             {/* Gradient overlay to blend image into background */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#002878]"></div>
          </div>
          
          {/* Right: Content */}
          <div className="w-full md:w-1/2 p-8 md:p-12 text-white relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              <span className="text-blue-200">Super</span>PRO!
            </h2>
            <p className="text-xl md:text-2xl font-semibold mb-6 max-w-sm leading-snug">
              Commandez votre carrière avec <span className="text-red-500 font-bold bg-white px-2 rounded-sm inline-block transform -skew-x-12 ml-1">ELAMINE</span>
              <br />Dès aujourd'hui
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-6 rounded shadow-md transition-colors">
              Rejoignez-nous
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
