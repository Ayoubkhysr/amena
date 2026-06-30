import { Link } from 'react-router-dom';

const ProductsRanges = () => {
  const categories = [
    { id: 1, name: "SOL ET SURFACE", slug: "sol-et-surface", image: "https://placehold.co/100x150/00BFFF/FFF?text=Sol" },
    { id: 2, name: "LESSIVE LINGE", slug: "lessive", image: "https://placehold.co/100x150/FF69B4/FFF?text=Lessive" },
    { id: 3, name: "NETTOYANT", slug: "nettoyant", image: "https://placehold.co/100x150/FFF/000?text=Nettoyant" },
    { id: 4, name: "VAISELLE", slug: "vaisselle", image: "https://placehold.co/100x150/FFD700/FFF?text=Vaisselle" },
    { id: 5, name: "DESODORISANTS", slug: "desodorisants", image: "https://placehold.co/100x150/4169E1/FFF?text=Desodorisant" },
    { id: 6, name: "OUTILS DE NETTOYAGE", slug: "outils", image: "https://placehold.co/150x100/A9A9A9/FFF?text=Outils" },
  ];

  return (
    <section className="w-full py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2" style={{ fontFamily: 'cursive' }}>
            Nos gamme des produits
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">DÉCOUVREZ NOS SOLUTIONS D'ENTRETIEN,<br/>DE FRAÎCHEUR ET DE BIEN-ÊTRE.</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/produits/${category.slug}`}
              className="bg-[#c2eaff] rounded-xl overflow-hidden shadow-sm flex items-center h-32 hover:bg-[#a1e0ff] transition-colors cursor-pointer group block"
            >
              {/* Image Container */}
              <div className="w-1/2 h-full flex justify-center items-center bg-white/30 p-2 relative">
                 <img src={category.image} alt={category.name} className="max-h-full object-contain z-10 drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>
              
              {/* Text Container */}
              <div className="w-1/2 p-4 text-[#0055c4]">
                <p className="text-xs font-light mb-1 uppercase opacity-80">Gamme</p>
                <h3 className="font-bold text-lg leading-tight uppercase">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsRanges;
