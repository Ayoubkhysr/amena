const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      text: "Commande reçue rapidement, tout est parfait.",
      author: "Khadija Bouazizi",
      date: "03-08-2024",
      rating: 5,
    },
    {
      id: 2,
      text: "Commande reçue rapidement, tout est parfait.",
      author: "Khadija Bouazizi",
      date: "03-08-2024",
      rating: 5,
    },
    {
      id: 3,
      text: "Commande reçue rapidement, tout est parfait.",
      author: "Khadija Bouazizi",
      date: "03-08-2024",
      rating: 5,
    },
  ];

  return (
    <section className="w-full py-16 bg-[#e6f2ff]">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-2 italic" style={{ fontFamily: 'cursive' }}>
            Les avis de nos clients
          </h2>
          <div className="flex justify-center items-center space-x-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">4.87/5 - Excellent</span>
          </div>
        </div>

        {/* Carousel/Grid */}
        <div className="flex items-center justify-center space-x-4">
          {/* Left Arrow Placeholder */}
          <button className="bg-white rounded-full p-2 shadow hover:bg-gray-100 text-gray-500 hidden md:block">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
             </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm text-center flex flex-col items-center border border-gray-100">
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic text-sm mb-6">"{t.text}"</p>
                <div className="mt-auto">
                  <p className="font-bold text-gray-800 text-sm">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Placeholder */}
          <button className="bg-white rounded-full p-2 shadow hover:bg-gray-100 text-gray-500 hidden md:block">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
             </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
