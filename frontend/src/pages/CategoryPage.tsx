import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import CategorySidebar, { FilterSection } from '../components/category/CategorySidebar';
import CategoryProductGrid, { ProductItem } from '../components/category/CategoryProductGrid';
import { useStore } from '../context/StoreContext';
import { fetchProductsPage, resolveImageUrl, toUiProduct } from '../services/productService';

function CategoryPage() {
  const { category } = useParams();
  const { categories } = useStore();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterSection[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 1000 });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  
  // Basic formatting to capitalize and replace dashes with spaces
  const formattedCategoryName = category 
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Catégorie';

  // Dynamic Filters based on category subcategories

  useEffect(() => {
    const categoryObj = categories.find(c => 
      c.slug === category || 
      c.name.toLowerCase() === formattedCategoryName.toLowerCase()
    );

    const dynamicFilters: FilterSection[] = [];

    if (categoryObj) {
      // Find subcategories for this category
      const subCategories = categories.filter(c => c.parentId === String(categoryObj.id));
      if (subCategories.length > 0) {
        dynamicFilters.push({
          title: 'Sous-catégories',
          options: subCategories.map(c => c.name)
        });
      }
    }

    // Add a default filter for sorting/popularity
    dynamicFilters.push({
      title: 'Popularité',
      options: ['Meilleures ventes', 'Nouveautés', 'Promotions']
    });

    setFilters(dynamicFilters);
    setSelectedFilters({}); // Reset filters on category change
  }, [category, categories, formattedCategoryName]);

  useEffect(() => {
    async function loadCategoryProducts() {
      setLoading(true);
      try {
        // Find category ID by slug or name matching
        const categoryObj = categories.find(c => 
          c.slug === category || 
          c.name.toLowerCase() === formattedCategoryName.toLowerCase()
        );

        let categoryId: number | undefined = undefined;
        if (categoryObj) {
          categoryId = Number(categoryObj.id);
        }

        const page = await fetchProductsPage(0, 1000, undefined, categoryId, undefined, 'createdAt', 'desc', undefined, true);
        
        // Ensure we only show products belonging to this category (in case categoryId was undefined, we filter manually as a fallback, or just rely on API)
        let apiProducts = page.content;
        
        // If category object was not found initially, we can try to filter by category name from the products
        if (!categoryObj && formattedCategoryName) {
            // Note: Since API doesn't know the category without ID, it returned all products. We filter manually.
            apiProducts = apiProducts.filter(p => {
               const cat = categories.find(c => Number(c.id) === p.categoryId);
               return cat?.slug === category || cat?.name.toLowerCase() === formattedCategoryName.toLowerCase();
            });
        }

        const mappedProducts: ProductItem[] = apiProducts.map(p => {
          const uiProd = toUiProduct(p, categories);

          return {
            id: p.id,
            name: uiProd.name,
            category: uiProd.category,
            subcategories: uiProd.subcategories,
            price: `${uiProd.price.toFixed(3)}dt`, // Using toFixed(3) as TND usually has 3 decimal places
            rating: 5, // Mock rating as it's not in API yet
            image: uiProd.imageUrl || `https://placehold.co/150x250/E5E7EB/A1A1AA?text=${encodeURIComponent(uiProd.name)}`
          };
        });

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to load products for category", error);
      } finally {
        setLoading(false);
      }
    }

    if (categories.length > 0) {
      loadCategoryProducts();
    }
  }, [category, categories, formattedCategoryName, refreshTrigger]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRefreshTrigger(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleFilterChange = (newSelected: Record<string, string[]>) => {
    setSelectedFilters(newSelected);
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Sous-catégories
    const selectedSubcats = selectedFilters['Sous-catégories'];
    if (selectedSubcats && selectedSubcats.length > 0) {
      result = result.filter(product => {
        // If product has subcategories, check if any overlap
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

    // Add filtering for other things like Popularité if needed here

    return result;
  }, [products, selectedFilters, minPrice, maxPrice]);

  return (
    <div className="w-full flex flex-col font-sans bg-[#fbfcfd]">
      <PageBreadcrumb pageName={formattedCategoryName} />
      
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

export default CategoryPage;
