import { useStore } from '../../context/StoreContext';

const AboutHistorySection = () => {
  const { aboutConfig } = useStore();
  
  const title = aboutConfig?.historyTitle || "Votre quotidien, C'est notre Rayon !";
  const text = aboutConfig?.historyText || `Depuis 2015, EL AMINE vous propose une large sélection de produits efficaces, 
pratiques et malins pour prendre soin de votre intérieur au quotidien.

Devenus incontournables, les célèbres produits bleus de la marque sont 
présents dans de nombreux foyers !`;
  const imageUrl = aboutConfig?.historyImageUrl || '/images/Rectangle 381.png';

  // Split title if it contains a comma or specific markers, otherwise just render it
  const titleParts = title.split(',');
  const hasComma = titleParts.length > 1;

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Text */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-[cursive]">
            {hasComma ? (
              <>
                <span className="text-[#007dd6]">{titleParts[0]},</span>
                <br />
                <span className="text-[#007dd6]">{titleParts.slice(1).join(',')}</span>
              </>
            ) : (
              <span className="text-[#007dd6]">{title}</span>
            )}
          </h2>
          <div className="text-sm text-gray-700 space-y-4 font-medium leading-relaxed max-w-sm whitespace-pre-wrap">
            <p>{text}</p>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            src={imageUrl}
            alt="El Amine Products"
            className="w-full max-w-md h-auto rounded-xl shadow-lg object-cover"
          />
        </div>

      </div>
    </section>
  );
};

export default AboutHistorySection;
