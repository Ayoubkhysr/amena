import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import CategorySidebar, { FilterSection } from '../components/category/CategorySidebar';
import CategoryProductGrid, { ProductItem } from '../components/category/CategoryProductGrid';
import { useStore } from '../context/StoreContext';
import { fetchProductsPage, toUiProduct, fetchBestSellers } from '../services/productService';

function AllProductsPage() {
  const { categories } = useStore();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterSection[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [bestSellerIds, setBestSellerIds] = useState<Set<number>>(new Set());
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || undefined;
  
  useEffect(() => {
    const dynamicFilters: FilterSection[] = [];

    // Filter top-level categories (gammes)
    const topCategories = categories.filter(c => !c.parentId);
    if (topCategories.length > 0) {
      dynamicFilters.push({
        title: 'Gammes',
        options: topCategories.map(c => c.name)
      });
    }

    // Filter subcategories ONLY if gammes are selected
    const selectedGammes = selectedFilters['Gammes'] || [];
    if (selectedGammes.length > 0) {
      const selectedGammeIds = topCategories
        .filter(c => selectedGammes.includes(c.name))
        .map(c => c.id);

      const relevantSubCategories = categories.filter(c => 
        c.parentId && selectedGammeIds.includes(c.parentId)
      );

      if (relevantSubCategories.length > 0) {
        dynamicFilters.push({
          title: 'Sous-catégories',
          options: relevantSubCategories.map(c => c.name)
        });
      }
    }

    // Add a default filter for sorting/popularity
    dynamicFilters.push({
      title: 'Popularité',
      options: ['Meilleures ventes', 'Nouveautés', 'Promotions']
    });

    setFilters(dynamicFilters);
  }, [categories, selectedFilters]);

  useEffect(() => {
    async function loadAllProducts() {
      setLoading(true);
      try {
        const [page, bestSellers] = await Promise.all([
          fetchProductsPage(0, 1000, searchQuery, undefined, undefined, 'createdAt', 'desc', undefined, true),
          fetchBestSellers(20)
        ]);
        
        const bestSellerIdSet = new Set(bestSellers.map(p => Number(p.id)));
        setBestSellerIds(bestSellerIdSet);

        const apiProducts = page.content;

        const mappedProducts: ProductItem[] = apiProducts.map(p => {
          const uiProd = toUiProduct(p, categories);
          return {
            id: p.id,
            name: uiProd.name,
            category: uiProd.category,
            subcategories: uiProd.subcategories,
            price: `${uiProd.price.toFixed(3)}dt`,
            compareAtPrice: uiProd.compareAtPrice ? `${uiProd.compareAtPrice.toFixed(3)}dt` : undefined,
            createdAt: uiProd.createdAt,
            isBestSeller: bestSellerIdSet.has(Number(p.id)),
            rating: 5,
            image: uiProd.imageUrl || `https://placehold.co/150x250/E5E7EB/A1A1AA?text=${encodeURIComponent(uiProd.name)}`
          };
        });

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to load all products", error);
      } finally {
        setLoading(false);
      }
    }

    if (categories.length > 0) {
      loadAllProducts();
    }
  }, [categories, searchQuery]);

  const handleFilterChange = (newSelected: Record<string, string[]>) => {
    setSelectedFilters(newSelected);
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Gammes
    const selectedGammes = selectedFilters['Gammes'];
    if (selectedGammes && selectedGammes.length > 0) {
      result = result.filter(product => {
        return selectedGammes.includes(product.category);
      });
    }

    // Filter by Sous-catégories
    const selectedSubcats = selectedFilters['Sous-catégories'];
    if (selectedSubcats && selectedSubcats.length > 0) {
      result = result.filter(product => {
        if (product.subcategories && product.subcategories.length > 0) {
          return product.subcategories.some(sub => selectedSubcats.includes(sub));
        }
        return false;
      });
    }

    // Filter by Price
    if (minPrice !== undefined) {
      result = result.filter(product => {
        const priceNum = parseFloat(product.price.replace('dt', '').trim());
        return !isNaN(priceNum) && priceNum >= minPrice;
      });
    }
    
    if (maxPrice !== undefined) {
      result = result.filter(product => {
        const priceNum = parseFloat(product.price.replace('dt', '').trim());
        return !isNaN(priceNum) && priceNum <= maxPrice;
      });
    }

    // Filter by Popularité (OR logic across selected popularity types)
    const popularityFilters = selectedFilters['Popularité'] || [];
    const isPromoParam = searchParams.get('promo') === 'true';
    
    if (popularityFilters.length > 0 || isPromoParam) {
      result = result.filter(product => {
        let isMatch = false;

        if (popularityFilters.includes('Promotions') || isPromoParam) {
          if (product.compareAtPrice) {
            const comparePriceNum = parseFloat(product.compareAtPrice.replace('dt', '').trim());
            const priceNum = parseFloat(product.price.replace('dt', '').trim());
            if (!isNaN(comparePriceNum) && !isNaN(priceNum) && comparePriceNum > priceNum) {
              isMatch = true;
            }
          }
        }

        if (popularityFilters.includes('Nouveautés') && product.createdAt) {
          const createdAtDate = new Date(product.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          if (createdAtDate >= thirtyDaysAgo) {
            isMatch = true;
          }
        }

        if (popularityFilters.includes('Meilleures ventes') && product.isBestSeller) {
          isMatch = true;
        }

        return isMatch;
      });
    }

    return result;
  }, [products, selectedFilters, minPrice, maxPrice, searchParams]);

  const isPromoPage = searchParams.get('promo') === 'true';
  const pageTitle = searchQuery ? `Résultats pour "${searchQuery}"` : isPromoPage ? "Nos Promotions" : "Tous les Produits";

  return (
    <div className="w-full flex flex-col font-sans bg-[#fbfcfd]">
      <PageBreadcrumb pageName={pageTitle} />
      
      <div className="max-w-7xl mx-auto w-full px-8 py-10 flex flex-col md:flex-row gap-8">
        <CategorySidebar 
          filters={filters} 
          selectedFilters={selectedFilters}
          minPriceValue={minPrice}
          maxPriceValue={maxPrice}
          onFilterChange={handleFilterChange} 
          onPriceChange={handlePriceChange} 
        />
        {loading ? (
          <div className="w-full flex justify-center items-center h-64">
            <p className="text-slate-500 font-medium">Chargement des produits...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <CategoryProductGrid products={filteredProducts} />
        ) : (
          <div className="w-full flex justify-center items-center h-64 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-500 font-medium text-lg">Aucun produit ne correspond à vos filtres.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProductsPage;
