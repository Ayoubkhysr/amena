const PromoBanner = () => {
  return (
    <section className="w-full py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <div
          className="w-full bg-[#002878] rounded-2xl overflow-hidden flex flex-col md:flex-row items-center relative shadow-2xl"
          style={{
            backgroundImage: 'url(/images/Rectangle%2010.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay so the white text stays readable over the background image */}
          <div className="absolute inset-0 bg-[#002878]/70"></div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 p-8 md:p-12 text-white relative z-10 md:ml-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              <span className="text-blue-200">Super</span>PRO!
            </h2>
            <p className="text-xl md:text-2xl font-semibold mb-6 max-w-sm leading-snug">
              Commandez votre carrière avec <span className="text-red-500 font-bold bg-white px-2 rounded-sm inline-block transform -skew-x-12 ml-1">ELAMINE</span>
              <br />Dès aujourd'hui
            </p>
            <button
              onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSeTqJOBYd7pReyzGJz16MXdbTjvhr0TS496H0O0hPYngwkMDw/viewform', '_blank')}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-6 rounded shadow-md transition-colors"
            >
              Rejoignez-nous
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
