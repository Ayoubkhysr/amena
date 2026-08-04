import { Link } from 'react-router-dom';

const ProductRangesSection = () => {
  const categories = [
    { id: 1, name: "SOL ET SURFACE", image: "/images/Sol%20Et%20Surface.png" },
    { id: 2, name: "LESSIVE LINGE", image: "/images/lessive.png" },
    { id: 3, name: "NETTOYANT", image: "/images/Gamme%20%20NETTOYANT.png" },
    { id: 4, name: "VAISSELLE", image: "/images/Gamme%20%20VAISSELLE.png" },
    { id: 5, name: "DÉSODORISANTS", image: "/images/Desodorisants.png" },
    { id: 6, name: "OUTILS DE NETTOYAGE", image: "/images/Gamme%20%20ENTRETIEN%20NETTOYAGE.png" },
  ];

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-red-600 mb-2 font-[cursive]">
            Nos Gamme Produits
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">DÉCOUVREZ TOUTE NOTRE GAMME</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const slug = category.name.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return (
              <Link
                key={category.id}
                to={`/produits/${slug}`}
                className="bg-[#00bfff] rounded-xl shadow-md flex items-center min-h-24 sm:h-28 md:h-32 hover:bg-[#00a8e6] transition-colors cursor-pointer group relative block"
              >
                {/* Image Container */}
                <div className="w-1/2 h-full flex justify-center items-center relative">
                   <img
                     src={category.image}
                     alt={category.name}
                     className="h-[130%] sm:h-[140%] md:h-[150%] w-auto object-contain z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                   />
                </div>

                {/* Text Container */}
                <div className="w-1/2 p-4 text-white relative z-10">
                  <p className="text-xs font-light mb-1 uppercase opacity-80">Gamme</p>
                  <h3 className="font-bold text-lg leading-tight uppercase">{category.name}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductRangesSection;
