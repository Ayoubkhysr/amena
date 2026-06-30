import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Dynamic classes based on route
  const navBgClass = isHome ? "bg-[#007dd6]" : "bg-white";
  const navTextClass = isHome ? "text-white" : "text-gray-800";
  const hoverTextClass = isHome ? "hover:text-red-200" : "hover:text-red-600";
  const logoSrc = isHome ? "/logo-el-amine.png" : "/logo-el-amine.png"; // Assuming same logo, just maybe different shadow

  return (
    <header className="w-full font-sans">
      {/* Top Red Bar */}
      <div className="bg-red-600 text-white text-[13px] py-2 px-4 text-center font-medium tracking-wide">
        5% de réduction sur votre premier achat sur notre Site. Coupon: ELAMINE5
      </div>
      
      {/* Main Navigation */}
      <nav className={`${navBgClass} ${navTextClass} py-4 px-8 flex justify-center items-center relative z-10 ${isHome ? 'shadow-sm' : 'border-b border-gray-100 shadow-sm'}`}>
        
        {/* Container for links and logo to keep them centered together */}
        <div className="flex items-center space-x-12">
          
          {/* Left Links */}
          <div className="flex space-x-8 text-sm font-medium items-center">
            <Link to="/" className={`${hoverTextClass} ${isHome ? 'font-bold' : ''}`}>Accueil</Link>
            <Link to="/produits" className={`${hoverTextClass} ${!isHome ? 'font-bold' : ''}`}>Produits</Link>
            <Link to="/accessoires" className={hoverTextClass}>Accessoires</Link>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center items-center">
            <img src={logoSrc} alt="El Amine Logo" className={`h-16 w-auto object-contain ${isHome ? 'drop-shadow-2xl' : ''}`} />
          </div>

          {/* Right Links & Icons */}
          <div className="flex items-center space-x-8 text-sm font-medium">
            <Link to="/a-propos" className={hoverTextClass}>À propos</Link>
            <Link to="/nos-magasins" className={hoverTextClass}>Nos magasins</Link>
            <Link to="/contact" className={hoverTextClass}>Contact</Link>
            
            <div className="flex items-center space-x-5 pl-4">
               {/* Search Icon */}
               <button className={hoverTextClass}>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                 </svg>
               </button>
               {/* User Icon */}
               <button className={hoverTextClass}>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                 </svg>
               </button>
               {/* Cart Icon */}
               <button className={hoverTextClass}>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                 </svg>
               </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
