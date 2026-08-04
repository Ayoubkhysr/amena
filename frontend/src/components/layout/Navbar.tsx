import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const Navbar = () => {
  const { topHeaderText } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Dynamic classes based on route
  const navBgClass = isHome ? "bg-[#007dd6]" : "bg-[#f9f9f9]";
  const navTextClass = isHome ? "text-white" : "text-gray-800";
  const hoverTextClass = isHome ? "hover:text-white" : "hover:text-red-600";
  const linkTextClass = isHome ? "text-white/90" : "text-gray-600";
  const logoSrc = "/logo-el-amine.png";

  return (
    <header className="w-full font-sans">
      {/* Top Red Bar */}
      {topHeaderText && (
        <div className="bg-[#e60000] text-white text-[13px] py-2 px-4 font-medium tracking-wide overflow-hidden whitespace-nowrap w-full relative">
          <div className="animate-marquee hover:[animation-play-state:paused] inline-block">
            {topHeaderText}
          </div>
        </div>
      )}
      
      {/* Main Navigation */}
      <nav className={`${navBgClass} ${navTextClass} py-5 px-8 flex justify-center items-center relative z-50 ${!isHome ? 'border-b border-gray-200' : ''}`}>
        <div className="max-w-7xl w-full flex items-center justify-between">
          
          {/* Left Logo */}
          <div className="flex-1 flex justify-start z-20">
            <Link to="/">
              <img 
                src={logoSrc} 
                alt="El Amine Logo" 
                className={`h-20 md:h-28 w-auto object-contain transition-all duration-300 ${isHome ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]' : ''}`} 
              />
            </Link>
          </div>

          {/* Center Content (Search + Desktop Links) */}
          <div className="hidden md:flex flex-col items-center gap-4 w-full max-w-2xl px-4">
            
            {/* Search & Cart Row */}
            <div className="w-full flex items-center gap-5">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Rechercher"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/tous-les-produits?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className={`w-full rounded-full py-2.5 px-6 text-sm outline-none transition-colors
                    ${isHome 
                      ? 'bg-transparent border border-white text-white placeholder-white' 
                      : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-gray-400'
                    }`}
                />
              </div>
              {/* Cart Icon */}
              <Link to="/panier" className="flex-shrink-0 min-w-11 min-h-11 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-current">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </Link>
            </div>

            {/* Links Row */}
            <div className={`flex items-center justify-center space-x-6 text-[13px] font-medium w-full whitespace-nowrap ${linkTextClass}`}>
              <Link to="/" className={`${hoverTextClass} transition-colors`}>Accueil</Link>
              <Link to="/tous-les-produits" className={`${hoverTextClass} transition-colors`}>Nos Produits</Link>
              <Link to="/produits" className={`${hoverTextClass} transition-colors`}>Nos gammes</Link>
              <span className={`${linkTextClass} opacity-50 cursor-not-allowed transition-colors`} title="Bientôt disponible">Accessoires</span>
              <Link to="/a-propos" className={`${hoverTextClass} transition-colors`}>À propos</Link>
              <Link to="/nos-magasins" className={`${hoverTextClass} transition-colors`}>Nos magasins</Link>
              <span className={`${linkTextClass} opacity-50 cursor-not-allowed transition-colors`} title="Bientôt disponible">Promos</span>
            </div>

          </div>

          {/* Right Empty Space (for centering on desktop) */}
          <div className="hidden md:flex flex-1 justify-end"></div>

          {/* Mobile Right Content (Cart + Hamburger) */}
          <div className="flex md:hidden items-center gap-4 z-20 text-current">
            <Link to="/panier" className="flex-shrink-0 min-w-11 min-h-11 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="min-w-11 min-h-11 flex items-center justify-center focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`absolute top-full left-0 w-full bg-white text-gray-800 shadow-xl transition-all duration-300 ease-in-out md:hidden overflow-hidden ${isMobileMenuOpen ? 'max-h-[calc(100vh-80px)] border-b border-gray-200 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {/* Mobile Search */}
            <div className="relative w-full mb-2">
              <input 
                type="text" 
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/tous-les-produits?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="w-full rounded-full py-2.5 px-6 text-sm outline-none bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-500 focus:border-gray-400"
              />
            </div>
            
            <Link to="/" className="font-semibold text-lg hover:text-red-600 transition-colors py-2 border-b border-gray-100">Accueil</Link>
            <Link to="/tous-les-produits" className="font-semibold text-lg hover:text-red-600 transition-colors py-2 border-b border-gray-100">Nos Produits</Link>
            <Link to="/produits" className="font-semibold text-lg hover:text-red-600 transition-colors py-2 border-b border-gray-100">Nos gammes</Link>
            <span className="font-semibold text-lg text-gray-400 cursor-not-allowed py-2 border-b border-gray-100" title="Bientôt disponible">Accessoires</span>
            <Link to="/a-propos" className="font-semibold text-lg hover:text-red-600 transition-colors py-2 border-b border-gray-100">À propos</Link>
            <Link to="/nos-magasins" className="font-semibold text-lg hover:text-red-600 transition-colors py-2 border-b border-gray-100">Nos magasins</Link>
            <span className="font-semibold text-lg text-gray-400 cursor-not-allowed py-2" title="Bientôt disponible">Promos</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
