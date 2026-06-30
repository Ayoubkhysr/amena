import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import BestSellersSection from '../components/home/BestSellersSection';
import PromoBanner from '../components/home/PromoBanner';
import ProductRangesSection from '../components/home/ProductRangesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';

function HomePage() {
  return (
    <div className="w-full flex flex-col font-sans bg-gray-50">
      <HeroSection />
      <FeaturesSection />
      <BestSellersSection />
      <PromoBanner />
      <ProductRangesSection />
      <TestimonialsSection />
    </div>
  );
}

export default HomePage;
