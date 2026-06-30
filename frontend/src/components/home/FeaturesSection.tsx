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
        <div className="w-full md:w-2/3 relative flex justify-center items-center h-80">
          {/* Bubble 1 (Small) */}
          <div className="absolute top-0 left-1/4 w-16 h-16 rounded-full border-2 border-gray-300 bg-white shadow-sm"></div>
          
          {/* Bubble 2 (Medium - Top Left) */}
          <div className="absolute top-12 left-1/3 w-32 h-32 rounded-full border-4 border-blue-200 bg-white shadow-lg overflow-hidden flex items-center justify-center z-10">
             <img src="https://placehold.co/100x150/FFC0CB/FFF?text=Produit+1" alt="Product" className="h-24 w-auto" />
          </div>

          {/* Bubble 3 (Large - Center Right) */}
          <div className="absolute top-20 left-1/2 w-48 h-48 rounded-full border-4 border-blue-200 bg-white shadow-xl overflow-hidden flex items-center justify-center z-20">
             <img src="https://placehold.co/150x200/FF69B4/FFF?text=Produit+2" alt="Product" className="h-40 w-auto" />
          </div>

          {/* Arabic Title Graphic Placeholder */}
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 z-30">
            <div className="bg-red-600 text-white text-3xl font-bold px-6 py-2 rounded shadow-xl border-b-4 border-r-4 border-blue-800 transform rotate-[-5deg]">
              النظافة<br/>صنعتنا
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
