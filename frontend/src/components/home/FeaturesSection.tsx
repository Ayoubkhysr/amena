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
            Notre objectif est de proposer des produits de haute qualité avec des prix très compétitifs, qui répondent aux besoins des ménages tunisiens. Nous mettons à votre disposition une large gamme de produits pour satisfaire vos attentes: liquides vaisselle, nettoyants et produits d'hygiène, désodorisants et autres.
          </p>
        </div>

        {/* Right Side: Arabic Text Graphic Only */}
        <div className="w-full md:w-2/3 flex justify-center items-center mt-12 md:mt-0">
          <img src="/images/image 1.png" alt="El Amine" className="w-48 sm:w-64 md:w-80 h-auto object-contain drop-shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
