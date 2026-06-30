const ProductsBestSellers = () => {
  const products = [
    {
      id: 1,
      name: "Ezzahra",
      description: "Gel machine Automatique",
      price: "16,500dt",
      image: "https://placehold.co/150x200/ADD8E6/FFF?text=Ezzahra",
      rating: 5,
    },
    {
      id: 2,
      name: "Super Dégraissant",
      description: "Anti-graisse",
      price: "10,000dt",
      image: "https://placehold.co/150x200/FFA500/FFF?text=Degraissant",
      rating: 5,
    },
    {
      id: 3,
      name: "Top gel 3L",
      description: "Liquide vaisselle",
      price: "13,500dt",
      image: "https://placehold.co/150x200/FFD700/FFF?text=Top+Gel",
      rating: 5,
    },
    {
      id: 4,
      name: "El Bahja",
      description: "Parfum concentrée",
      price: "9,500dt",
      image: "https://placehold.co/150x200/DAA520/FFF?text=El+Bahja",
      rating: 5,
    },
  ];

  return (
    <section className="w-full py-16 bg-gray-50 mb-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0055c4] mb-2" style={{ fontFamily: 'cursive' }}>
            Nos Best-Sellers
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">DÉCOUVREZ NOS PRODUITS PHARES</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm p-4 border border-blue-200 flex flex-col items-center hover:shadow-xl transition-shadow cursor-pointer group">
              <img src={product.image} alt={product.name} className="h-48 object-contain mb-4 group-hover:scale-105 transition-transform" />
              <div className="w-full text-left">
                <div className="flex justify-between items-start mb-1">
                   <h3 className="font-bold text-gray-800 text-sm truncate">{product.name}</h3>
                   <div className="flex text-yellow-400 text-[10px]">
                     {[...Array(product.rating)].map((_, i) => (
                       <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                         <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                       </svg>
                     ))}
                   </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{product.description}</p>
                <span className="font-bold text-[#007dd6]">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsBestSellers;
