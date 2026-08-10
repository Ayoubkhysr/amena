import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full font-sans">
      {/* Top Blue Bar - Socials */}
      <div className="bg-[#003eb3] text-white py-8 px-8 flex justify-center items-center">
        {/* Socials */}
        <div className="flex items-center gap-10">
          <span className="font-bold text-base tracking-[0.25em] uppercase">SUIVEZ-NOUS</span>
          <div className="flex items-center gap-6">
            <a href="https://www.facebook.com/share/1CzqT8s585/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
              {/* Facebook Icon */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/elamine.nettoyage?igsh=MWRmNDU5eGt2azIzaA==" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
              {/* Instagram Icon */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@elamine.official?_r=1&_t=ZS-97nuP7aQguC" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
              {/* TikTok Icon */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom White Section */}
      <div className="bg-white py-12 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo */}
        <div className="flex justify-center md:justify-start items-center">
           <img src="/logo-el-amine.png" alt="El Amine Logo" className="h-32 md:h-40 object-contain" />
        </div>
        
        {/* Products Links */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Nos produits</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><Link to="/produits/lessive-linge" className="hover:text-blue-600">Gamme Lessive Linge</Link></li>
            <li><Link to="/produits/vaisselle" className="hover:text-blue-600">Gamme Vaisselle</Link></li>
            <li><Link to="/produits/sol-et-surface" className="hover:text-blue-600">Gamme Sol et Surface</Link></li>
            <li><Link to="/produits/nettoyant-et-hygiene" className="hover:text-blue-600">Gamme Nettoyant et Hygiène</Link></li>
            <li><Link to="/produits/desodorisants" className="hover:text-blue-600">Gamme Désodorisant</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Nous contacter</h4>
          <ul className="text-sm text-gray-600 space-y-3">
            <li className="flex items-start">
               <span className="font-bold mr-2 text-gray-800">Tél:</span>
               <span>(+216) 28 305 400<br/>(+216) 52 815 070</span>
            </li>
            <li className="flex items-center">
               <span className="font-bold mr-2 text-gray-800">E-mail:</span>
               <a href="mailto:prodelamine@gmail.com" className="hover:text-blue-600">prodelamine@gmail.com</a>
            </li>
            <li className="flex items-start">
               <span className="font-bold mr-2 text-gray-800">Adresse:</span>
               <span>R.amilcar 5090 - Monastir - Bekalta</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
