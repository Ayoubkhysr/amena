const AboutValuesSection = () => {
  return (
    <section className="w-full py-16 bg-white mb-16">
      <div className="max-w-5xl mx-auto px-8 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Left Image Placeholder */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <img 
            src="https://placehold.co/500x300/404040/FFF?text=Storefront+Image" 
            alt="El Amine Storefront" 
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Right Text */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-6 text-[#007dd6]">
            Des valeurs fortes<br />au cœur de notre<br />ADN !
          </h2>
          <p className="text-[11px] text-gray-800 font-medium leading-relaxed">
            Des valeurs fortes sont au cœur de notre ADN. Qualité, 
            confiance et innovation guident chaque étape de notre 
            démarche, assurant des produits qui répondent aux 
            attentes les plus exigeantes. Nous nous engageons à 
            offrir le meilleur, tout en restant proches de nos clients 
            et respectueux de notre environnement.
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutValuesSection;
