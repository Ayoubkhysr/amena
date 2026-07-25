import { useStore } from '../../context/StoreContext';

const AboutHeroBanner = () => {
  const { aboutConfig } = useStore();
  const title = aboutConfig?.heroTitle || 'ELAMINE,';
  const subtitle = aboutConfig?.heroSubtitle || '10 Ans à vos cotés !';
  const imageUrl = aboutConfig?.heroImageUrl || '/images/Rectangle 244.png';
  
  return (
    <div className="w-full bg-[#f2fafd] flex justify-center py-10 px-8">
      <div className="max-w-7xl w-full bg-[#e6f7ff] rounded-lg overflow-hidden flex relative shadow-sm" style={{ minHeight: '300px' }}>
        {/* Background Accent (the blue diagonal split) */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00d0ff] transform skew-x-[-20deg] translate-x-20 z-0"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00bfff] transform skew-x-[-20deg] translate-x-32 z-0 opacity-50"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
          
          {/* Left Text */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:pl-16 py-8 md:py-12">
            <h1 className="text-[#0055c4] font-black text-3xl md:text-4xl xl:text-5xl uppercase leading-none mb-2">
              {title}
            </h1>
            <h2 className="text-red-600 font-black text-4xl md:text-5xl xl:text-6xl uppercase leading-none" dangerouslySetInnerHTML={{ __html: subtitle.replace(/\n/g, '<br />') }}>
            </h2>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 flex justify-end items-center">
            <img
              src={imageUrl}
              alt="Spray Bottle"
              className="w-full h-48 md:h-full object-cover object-left drop-shadow-xl z-20"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AboutHeroBanner;
