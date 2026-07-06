function NosMagasinsPage() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-[#007dd6] mb-3" style={{ fontFamily: 'cursive' }}>
          Nos Magasins
        </h1>
        <p className="text-gray-600 text-sm">
          Découvrez nos magasins et trouvez le
          <br />
          boutique El Amine la plus proche de
          <br />
          chez vous.
        </p>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Store Information */}
          <div className="bg-white p-8 space-y-8">
            {/* Address */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Adresse</h3>
              <p className="text-gray-700 text-sm">
                Tunis Centre ville, Bab Bhar,
                <br />
                Rue mongi slim
              </p>
            </div>

            {/* Hours */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Horaires</h3>
              <p className="text-gray-700 text-sm">Lundi - Dimanche : 9:00 - 20:00</p>
            </div>

            {/* Phone */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Téléphone</h3>
              <p className="text-gray-700 text-sm">
                (+216) 28 305 400
                <br />
                (+216) 29 004 444
              </p>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-md" style={{ height: '450px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.4897474!2d10.182!3d36.8065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ4JzIzLjQiTiAxMMKwMTAnNTUuMiJF!5e0!3m2!1sfr!2stn!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="El Amine Store Location"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="text-center py-12 bg-gray-50">
        <p className="text-red-600 font-bold text-lg mb-3">
          Vous ne trouvez pas votre boutique ?
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
          <span className="font-semibold">
            Service Client : <span className="font-bold">(+216) 28 305 400</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default NosMagasinsPage
