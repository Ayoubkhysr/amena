const AboutStatsBanner = () => {
  return (
    <section className="w-full py-12 bg-white flex justify-center px-8">
      <div className="max-w-5xl w-full bg-[#e6f2ff] rounded-3xl py-16 px-8 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'cursive' }}>
          <span className="text-red-600">Plus de 100</span>
          <br />
          <span className="text-[#007dd6]">Point de vente dans toute la Tunisie !</span>
        </h2>
        <p className="text-xs text-[#003366] font-bold max-w-lg mt-2 leading-relaxed">
          EL AMINE, une marque Tunisienne engagée qui propose une large gamme de produits pratiques et malins, pensés pour vous simplifier le ménage.
        </p>
      </div>
    </section>
  );
};

export default AboutStatsBanner;
