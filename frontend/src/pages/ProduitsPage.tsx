import PageBreadcrumb from '../components/common/PageBreadcrumb';
import ProductsRanges from '../components/products/ProductsRanges';
import BestSellersSection from '../components/home/BestSellersSection';

function ProduitsPage() {
  return (
    <div className="w-full flex flex-col font-sans bg-white">
      <PageBreadcrumb pageName="Gamme des Produits" />
      <ProductsRanges />
      <div className="mb-16">
        <BestSellersSection />
      </div>
    </div>
  );
}

export default ProduitsPage;
