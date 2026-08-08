import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import CategorySidebar, { FilterSection } from '../components/category/CategorySidebar';
import CategoryProductGrid, { ProductItem } from '../components/category/CategoryProductGrid';
import { useStore } from '../context/StoreContext';
import { fetchProductsPage, toUiProduct } from '../services/productService';

function AllProductsPage() {
  const { categories } = useStore();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterSection[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  
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
        const page = await fetchProductsPage(0, 1000, searchQuery, undefined, undefined, 'createdAt', 'desc', undefined, true);
        const apiProducts = page.content;

        const mappedProducts: ProductItem[] = apiProducts.map(p => {
          const uiProd = toUiProduct(p, categories);
          return {
            id: p.id,
            name: uiProd.name,
            category: uiProd.category,
            subcategories: uiProd.subcategories,
            price: `${uiProd.price.toFixed(3)}dt`,
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

    return result;
  }, [products, selectedFilters, minPrice, maxPrice]);

  const pageTitle = searchQuery ? `Résultats pour "${searchQuery}"` : "Tous les Produits";

  return (
    <div className="w-full flex flex-col font-sans bg-[#fbfcfd]">
      <PageBreadcrumb pageName={pageTitle} />
      
      <div className="max-w-7xl mx-auto w-full px-8 py-10 flex flex-col md:flex-row gap-8">
        <CategorySidebar filters={filters} onFilterChange={handleFilterChange} onPriceChange={handlePriceChange} />
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
