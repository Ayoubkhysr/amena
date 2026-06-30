export interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  image: string;
}

interface CategoryProductGridProps {
  products: ProductItem[];
}

const CategoryProductGrid = ({ products }: CategoryProductGridProps) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-2xl p-4 flex flex-col items-center hover:shadow-lg transition-shadow cursor-pointer"
            style={{ border: '1px solid #c2eaff' }}
          >
            {/* Image Container */}
            <div className="w-full h-56 flex justify-center items-center mb-4">
              <img src={product.image} alt={product.name} className="max-h-full object-contain" />
            </div>
            
            {/* Details */}
            <div className="w-full text-left">
              <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-gray-800 text-[13px] truncate pr-2">{product.name}</h3>
                 <div className="flex text-yellow-400 text-[10px] flex-shrink-0">
                   {[...Array(product.rating)].map((_, i) => (
                     <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                       <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                     </svg>
                   ))}
                 </div>
              </div>
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide">{product.category}</p>
              <span className="font-bold text-[#007dd6] text-sm">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductGrid;
