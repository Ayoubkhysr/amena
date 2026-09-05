import { Link } from 'react-router-dom';

const ProductsRanges = () => {
  const categories = [
    { id: 1, name: "SOL ET SURFACE", slug: "sol-et-surface", image: "/images/Sol%20Et%20Surface.png" },
    { id: 2, name: "LESSIVE LINGE", slug: "lessive-linge", image: "/images/lessive.png" },
    { id: 3, name: "NETTOYANT ET HYGIÈNE", slug: "nettoyant-et-hygiene", image: "/images/Gamme%20%20NETTOYANT.png" },
    { id: 4, name: "VAISSELLE", slug: "vaisselle", image: "/images/Gamme%20%20VAISSELLE.png" },
    { id: 5, name: "DÉSODORISANTS", slug: "desodorisants", image: "/images/Desodorisants.png" },
    { id: 6, name: "OUTILS DE NETTOYAGE", slug: "outils-de-nettoyage", image: "/images/Gamme%20%20ENTRETIEN%20NETTOYAGE.png" },
  ];

  return (
    <section className="w-full py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2 font-[cursive]">
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
              className="bg-[#c2eaff] rounded-xl shadow-sm flex items-center min-h-24 sm:h-28 md:h-32 hover:bg-[#a1e0ff] transition-colors cursor-pointer group block relative"
            >
              {/* Image Container */}
              <div className="w-1/2 h-full flex justify-center items-center relative">
                 <img
                   src={category.image}
                   alt={category.name}
                   className="h-32 sm:h-36 md:h-40 w-auto object-contain z-10 drop-shadow-md group-hover:scale-110 transition-transform"
                 />
              </div>

              {/* Text Container */}
              <div className="w-1/2 p-4 text-[#0055c4] relative z-10">
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
