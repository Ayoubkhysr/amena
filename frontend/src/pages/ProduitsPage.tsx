import PageBreadcrumb from '../components/common/PageBreadcrumb';
import ProductsRanges from '../components/products/ProductsRanges';
import ProductsBestSellers from '../components/products/ProductsBestSellers';

function ProduitsPage() {
  return (
    <div className="w-full flex flex-col font-sans bg-white">
      <PageBreadcrumb pageName="Gamme des Produits" />
      <ProductsRanges />
      <ProductsBestSellers />
    </div>
  );
}

export default ProduitsPage;
