const ProductRangesSection = () => {
  const categories = [
    { id: 1, name: "SOL ET SURFACE", image: "https://placehold.co/100x150/00BFFF/FFF?text=Sol" },
    { id: 2, name: "LESSIVE LINGE", image: "https://placehold.co/100x150/FF69B4/FFF?text=Lessive" },
    { id: 3, name: "NETTOYANT", image: "https://placehold.co/100x150/FFF/000?text=Nettoyant" },
    { id: 4, name: "VAISSELLE", image: "https://placehold.co/100x150/FFD700/FFF?text=Vaisselle" },
    { id: 5, name: "DÉSODORISANTS", image: "https://placehold.co/100x150/4169E1/FFF?text=Desodorisant" },
    { id: 6, name: "ENTRETIEN NETTOYAGE", image: "https://placehold.co/150x100/A9A9A9/FFF?text=Entretien" },
  ];

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-red-600 mb-2" style={{ fontFamily: 'cursive' }}>
            Nos Gamme Produits
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">DÉCOUVREZ TOUTE NOTRE GAMME</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-[#00bfff] rounded-xl overflow-hidden shadow-md flex items-center h-32 hover:bg-[#00a8e6] transition-colors cursor-pointer group"
            >
              {/* Image Container */}
              <div className="w-1/2 h-full flex justify-center items-center bg-white/20 p-2 relative">
                 <img src={category.image} alt={category.name} className="max-h-full object-contain z-10 drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>
              
              {/* Text Container */}
              <div className="w-1/2 p-4 text-white">
                <p className="text-xs font-light mb-1 uppercase opacity-80">Gamme</p>
                <h3 className="font-bold text-lg leading-tight uppercase">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRangesSection;
