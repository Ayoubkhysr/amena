import PageBreadcrumb from '../components/common/PageBreadcrumb';
import AboutHeroBanner from '../components/about/AboutHeroBanner';
import AboutHistorySection from '../components/about/AboutHistorySection';
import AboutStatsBanner from '../components/about/AboutStatsBanner';
import AboutValuesSection from '../components/about/AboutValuesSection';

function AboutPage() {
  return (
    <div className="w-full flex flex-col font-sans bg-white">
      <AboutHeroBanner />
      <PageBreadcrumb pageName="À propos" />
      <AboutHistorySection />
      <AboutStatsBanner />
      <AboutValuesSection />
    </div>
  );
}

export default AboutPage;
