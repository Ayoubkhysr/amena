const FeaturesSection = () => {
  return (
    <section className="w-full py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Text */}
        <div className="w-full md:w-1/2 text-gray-600 text-sm md:text-base leading-relaxed mb-12 md:mb-0">
          <p className="text-justify">
            Depuis 2016, Elamine incarne l'excellence dans la fabrication de produits de nettoyage, en alliant performance, innovation et exigence de qualité. Pensée pour répondre aux standards les plus élevés, la marque s'est imposée avec confiance à travers plus de 120 points de vente. Chaque produit Elamine est conçu pour offrir une efficacité remarquable, tout en apportant une expérience de propreté irréprochable au quotidien, aussi bien pour les particuliers que les professionnels.
          </p>
        </div>

        {/* Right Side: Arabic Text Graphic Only */}
        <div className="w-full md:w-1/2 flex justify-center items-center mt-12 md:mt-0">
          <img src="/images/image 1.png" alt="El Amine" className="w-48 sm:w-64 md:w-80 h-auto object-contain drop-shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
