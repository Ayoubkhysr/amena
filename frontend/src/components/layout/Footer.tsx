import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full font-sans">
      {/* Top Blue Bar - Newsletter & Socials */}
      <div className="bg-[#003eb3] text-white py-6 px-8 flex flex-col md:flex-row justify-between items-center">
        {/* Socials */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <span className="font-bold text-sm tracking-widest uppercase mr-4">SUIVEZ-NOUS</span>
          <a href="#" className="hover:text-blue-300">
            {/* Facebook Icon Placeholder */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" className="hover:text-blue-300">
             {/* Twitter/X Icon Placeholder */}
             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <span className="text-xs text-blue-200">Abonnez-vous à notre newsletter pour recevoir<br/>nos nouvelles publications et nos actualités.</span>
          <div className="flex">
            <input type="email" placeholder="Votre email" className="px-4 py-2 text-gray-800 text-sm focus:outline-none w-64" />
            <button className="bg-[#002878] px-4 py-2 hover:bg-blue-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom White Section */}
      <div className="bg-white py-12 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo */}
        <div className="flex justify-center md:justify-start items-center">
           <img src="/logo-el-amine.png" alt="El Amine Logo" className="h-24 object-contain" />
        </div>
        
        {/* Products Links */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Nos produits</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><Link to="/gamme/lessive" className="hover:text-blue-600">Gamme Lessive Linge</Link></li>
            <li><Link to="/gamme/vaisselle" className="hover:text-blue-600">Gamme Vaisselle</Link></li>
            <li><Link to="/gamme/sol" className="hover:text-blue-600">Gamme Sol et Surface</Link></li>
            <li><Link to="/gamme/nettoyant" className="hover:text-blue-600">Gamme Nettoyant</Link></li>
            <li><Link to="/gamme/desodorisant" className="hover:text-blue-600">Gamme Désodorisant</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Nous contacter</h4>
          <ul className="text-sm text-gray-600 space-y-3">
            <li className="flex items-start">
               <span className="font-bold mr-2 text-gray-800">Tél:</span> 
               <span>(+216) 71 832 211<br/>(+216) 71 832 233</span>
            </li>
            <li className="flex items-center">
               <span className="font-bold mr-2 text-gray-800">E-mail:</span>
               <a href="mailto:contact@elamine.tn" className="hover:text-blue-600">contact@elamine.tn</a>
            </li>
            <li className="flex items-start">
               <span className="font-bold mr-2 text-gray-800">Adresse:</span>
               <span>Z.I Mghira 3, lot 106<br/>Ben Arous 2082</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
