const FeaturesSection = () => {
  return (
    <section className="w-full py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Text */}
        <div className="w-full md:w-1/3 text-gray-600 text-sm leading-relaxed mb-12 md:mb-0">
          <p>
            El Amine est une marque tunisienne spécialisée dans la production des produits d'entretien et de nettoyage pour la maison, créée en 2021.
          </p>
          <p className="mt-4">
            Notre objectif est de proposer des produits de haute qualité avec des prix très compétitifs, qui répondent aux besoins des ménages tunisiens. Nous mettons à votre disposition une large gamme de produits pour satisfaire vos attentes: liquides vaisselle, nettoyants, désodorisants et autres.
          </p>
        </div>

        {/* Right Side: Bubbles & Arabic Text Graphic */}
        <div className="w-full md:w-2/3 relative flex justify-center items-center min-h-48 sm:min-h-64 md:h-80">
          {/* Bubble 1 (Small) */}
          <div className="absolute top-0 left-1/4 w-12 sm:w-16 h-12 sm:h-16 rounded-full border-2 border-gray-300 bg-white shadow-sm"></div>
          
          {/* Bubble 2 (Medium - Top Left) */}
          <div className="absolute top-8 sm:top-12 left-[30%] sm:left-1/3 w-24 sm:w-32 h-24 sm:h-32 rounded-full border-4 border-blue-200 bg-white shadow-lg overflow-hidden flex items-center justify-center z-10">
             <img src="/images/Pro1.png" alt="Product" className="h-16 sm:h-24 w-auto" />
          </div>

          {/* Bubble 3 (Large - Center Right) */}
          <div className="absolute top-12 sm:top-20 left-[40%] sm:left-1/2 w-36 sm:w-48 h-36 sm:h-48 rounded-full border-4 border-blue-200 bg-white shadow-xl overflow-hidden flex items-center justify-center z-20">
             <img src="/images/pro3.png" alt="Product" className="h-28 sm:h-40 w-auto" />
          </div>

          {/* Arabic Title Graphic */}
          <div className="absolute right-0 sm:-right-16 md:-right-32 top-1/2 transform -translate-y-1/2 z-40 opacity-60 sm:opacity-80 md:opacity-100">
            <img src="/images/image 1.png" alt="El Amine" className="w-24 sm:w-32 md:w-auto max-w-xs" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
