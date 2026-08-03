import { useEffect, useState, useContext } from 'react';
import { fetchBestSellers, resolveImageUrl } from '../../services/productService';
import type { ApiProduct } from '../../services/productService';
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

const BestSellersSection = () => {
  const [bestsellers, setBestsellers] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const storeContext = useContext(StoreContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchBestSellers(4);
        setBestsellers(products);
      } catch (error) {
        console.error('Failed to load best sellers', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Fallback to first 4 products if no sales exist yet
  const displayProducts = bestsellers.length > 0 
    ? bestsellers.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || 'Produit El Amine',
        price: `${p.price?.toFixed(3) || '0.000'} DT`,
        image: resolveImageUrl(p.imageUrl),
        rating: 5,
        slug: p.slug
      }))
    : (storeContext?.products || []).slice(0, 4).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || 'Produit El Amine',
        price: `${p.price?.toFixed(3) || '0.000'} DT`,
        image: p.imageUrl,
        rating: 5,
        slug: p.slug
      }));

  if (loading && displayProducts.length === 0) {
    return null;
  }

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-red-600 mb-2 font-[cursive]">
            Meilleures Ventes
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">PRODUITS LES MIEUX NOTÉS DE L'ANNÉE</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <Link to={`/produit/${product.slug}`} key={product.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-100 flex flex-col items-center hover:shadow-xl transition-shadow cursor-pointer block">
              <img src={product.image} alt={product.name} className="h-40 sm:h-48 object-contain mb-4 w-full" />
              <div className="w-full text-left mt-auto">
                <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-1">{product.description}</p>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-blue-600">{product.price}</span>
                  <div className="flex text-yellow-400 text-xs">
                    {[...Array(product.rating)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
