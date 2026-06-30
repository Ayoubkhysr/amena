const AboutHistorySection = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Text */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'cursive' }}>
            <span className="text-[#007dd6]">Votre quotidien,</span>
            <br />
            <span className="text-[#007dd6]">C'est notre </span>
            <span className="text-red-600 font-black">Rayon !</span>
          </h2>
          <div className="text-xs text-gray-700 space-y-4 font-medium leading-relaxed max-w-sm">
            <p>
              Depuis 2015, EL AMINE vous propose une large sélection de produits efficaces, 
              pratiques et malins pour prendre soin de votre intérieur au quotidien.
            </p>
            <p>
              Devenus incontournables, les célèbres produits bleus de la marque sont 
              présents dans de nombreux foyers !
            </p>
          </div>
        </div>

        {/* Right Image Placeholder */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="w-full max-w-md h-64 bg-gray-200 rounded-xl shadow-inner">
            {/* Replace with actual image later */}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutHistorySection;
