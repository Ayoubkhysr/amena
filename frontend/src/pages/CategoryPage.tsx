import { useParams } from 'react-router-dom';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import CategorySidebar, { FilterSection } from '../components/category/CategorySidebar';
import CategoryProductGrid, { ProductItem } from '../components/category/CategoryProductGrid';

function CategoryPage() {
  const { category } = useParams();
  
  // Basic formatting to capitalize and replace dashes with spaces
  const formattedCategoryName = category 
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Catégorie';

  // --- Dynamic Mock Data ---
  let filters: FilterSection[] = [];
  let products: ProductItem[] = [];

  if (category === 'lessive') {
    filters = [
      { title: 'Catégorie', options: ['Lessive', 'Adoucissant', 'Nettoyant multi-usage'] },
      { title: 'Usage', options: ['Machine automatique', 'Lavage à la main', 'Semi Automatique'] },
      { title: 'Popularité', options: ['Meilleures ventes', 'Nouveautés', 'Promotions'] },
    ];
    products = [
      { id: 1, name: "Noir", category: "Gel machine automatique", price: "17,000dt", rating: 5, image: "https://placehold.co/150x250/000000/FFF?text=Noir" },
      { id: 2, name: "Ezzahra", category: "Gel machine automatique", price: "16,500dt", rating: 5, image: "https://placehold.co/150x250/ADD8E6/FFF?text=Ezzahra" },
      { id: 3, name: "Savon Ezzahra", category: "Gel machine automatique", price: "16,500dt", rating: 5, image: "https://placehold.co/150x250/32CD32/FFF?text=Savon" },
      { id: 4, name: "Gold", category: "Gel machine automatique", price: "16,500dt", rating: 5, image: "https://placehold.co/150x250/DAA520/FFF?text=Gold" },
      { id: 5, name: "Loulou", category: "Gel machine automatique", price: "16,500dt", rating: 5, image: "https://placehold.co/150x250/FF1493/FFF?text=Loulou" },
      { id: 6, name: "Liptic", category: "Gel machine automatique", price: "16,500dt", rating: 5, image: "https://placehold.co/150x250/FFA500/FFF?text=Liptic" },
      { id: 7, name: "La famille", category: "Gel machine", price: "27,000dt", rating: 5, image: "https://placehold.co/200x150/FF8C00/FFF?text=La+famille" },
      { id: 8, name: "La famille", category: "Gel machine", price: "27,000dt", rating: 5, image: "https://placehold.co/200x150/4B0082/FFF?text=La+famille" },
      { id: 9, name: "La famille", category: "Gel machine", price: "27,000dt", rating: 5, image: "https://placehold.co/200x150/0000FF/FFF?text=La+famille" },
      { id: 10, name: "Amigo", category: "Gel machine automatique", price: "14,500dt", rating: 5, image: "https://placehold.co/150x250/800080/FFF?text=Amigo" },
      { id: 11, name: "Formidable", category: "Lavage manuel", price: "10,000dt", rating: 4, image: "https://placehold.co/150x250/D3D3D3/000?text=Formidable" },
      { id: 12, name: "Adoucissant", category: "Concentré", price: "5,500dt", rating: 5, image: "https://placehold.co/150x250/DDA0DD/FFF?text=Adoucissant" },
    ];
  } else if (category === 'nettoyant') {
    filters = [
      { title: 'Catégorie', options: ['Dégraissant', 'Détachant', 'Anticalcaire', 'Détartrant', 'Anti-mousse'] },
      { title: 'Usage', options: ['Cuisine', 'Salle de bain', 'Vitres', 'Sols', 'Multi-surfaces', 'Meubles'] },
      { title: 'Popularité', options: ['Meilleures ventes', 'Nouveautés', 'Promotions'] },
    ];
    products = [
      { id: 1, name: "PER Nettoyant", category: "Nettoyant Multi-surfaces", price: "14,500dt", rating: 5, image: "https://placehold.co/150x250/FF6347/FFF?text=PER" },
      { id: 2, name: "2en1 Linge", category: "Nettoyant anti-tâches", price: "14,000dt", rating: 5, image: "https://placehold.co/150x250/4682B4/FFF?text=2en1" },
      { id: 3, name: "Loulou", category: "Anti-insectes", price: "7,500dt", rating: 5, image: "https://placehold.co/150x250/000000/FFF?text=Loulou" },
      { id: 4, name: "VCL Cleaner", category: "Anti-calcaire", price: "9,900dt", rating: 5, image: "https://placehold.co/150x250/2E8B57/FFF?text=VCL" },
      { id: 5, name: "Oxybain", category: "Nettoyant Sanitaire", price: "12,000dt", rating: 5, image: "https://placehold.co/150x250/00BFFF/FFF?text=Oxybain" },
      { id: 6, name: "Pro Taches", category: "Anti-taches", price: "9,900dt", rating: 5, image: "https://placehold.co/150x250/4B0082/FFF?text=Pro+Taches" },
      { id: 7, name: "Super Détartrant", category: "Anti-calcaire Citron", price: "6,000dt", rating: 5, image: "https://placehold.co/150x250/333333/FFF?text=Detartrant" },
      { id: 8, name: "Super Détartrant", category: "Anti-calcaire", price: "6,000dt", rating: 5, image: "https://placehold.co/150x250/A9A9A9/000?text=Detartrant" },
      { id: 9, name: "Salle de bain", category: "Nettoyant", price: "12,000dt", rating: 5, image: "https://placehold.co/150x250/1E90FF/FFF?text=Salle+de+bain" },
      { id: 10, name: "Multi-usages", category: "Nettoyant", price: "8,500dt", rating: 5, image: "https://placehold.co/150x250/FF8C00/FFF?text=Multi" },
      { id: 11, name: "Nettoyant meuble", category: "Nettoyant", price: "4,000dt", rating: 5, image: "https://placehold.co/150x250/D2691E/FFF?text=Meuble" },
      { id: 12, name: "Lave Vitres", category: "Nettoyant", price: "5,500dt", rating: 5, image: "https://placehold.co/150x250/87CEFA/000?text=Vitres" },
      { id: 13, name: "Détachant", category: "Anti-cafards", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/FF4500/FFF?text=Detachant" },
      { id: 14, name: "La famille", category: "Nettoyant Multi usages", price: "25,000dt", rating: 5, image: "https://placehold.co/200x150/4682B4/FFF?text=La+Famille" },
      { id: 15, name: "Eau de Javel", category: "Après ménages", price: "3,500dt", rating: 5, image: "https://placehold.co/200x150/FFD700/000?text=Javel" },
    ];
  } else if (category === 'vaisselle') {
    filters = [
      { title: 'Catégorie', options: ['Anti-odeurs', 'Mains Sensibles', 'Classique'] },
      { title: 'Parfum', options: ['Citron', 'Pomme', 'Pêche', 'Aloe Vera', 'Naturel'] },
      { title: 'Popularité', options: ['Meilleures ventes', 'Nouveautés', 'Promotions'] },
    ];
    products = [
      { id: 1, name: "Extra+ Citron", category: "Liquide vaisselle", price: "3,500dt", rating: 5, image: "https://placehold.co/150x250/FFFF00/000?text=Citron" },
      { id: 2, name: "Extra+ Pomme", category: "Liquide vaisselle", price: "3,500dt", rating: 5, image: "https://placehold.co/150x250/32CD32/FFF?text=Pomme" },
      { id: 3, name: "Top Gel", category: "Liquide vaisselle", price: "3,900dt", rating: 5, image: "https://placehold.co/150x250/008000/FFF?text=Top+Gel" },
      { id: 4, name: "Vaisselle Peach", category: "Liquide vaisselle", price: "3,500dt", rating: 5, image: "https://placehold.co/150x250/FFDAB9/000?text=Peach" },
      { id: 5, name: "Aloe Verra", category: "Liquide vaisselle", price: "3,500dt", rating: 5, image: "https://placehold.co/150x250/98FB98/000?text=Aloe" },
      { id: 6, name: "Top Gel 3L", category: "Liquide vaisselle", price: "13,500dt", rating: 5, image: "https://placehold.co/200x250/008000/FFF?text=Top+Gel+3L" },
      { id: 7, name: "Vaisselle Peach 3L", category: "Liquide vaisselle", price: "13,500dt", rating: 5, image: "https://placehold.co/200x250/FFDAB9/000?text=Peach+3L" },
      { id: 8, name: "Aloe Verra 3L", category: "Liquide vaisselle", price: "13,500dt", rating: 5, image: "https://placehold.co/200x250/98FB98/000?text=Aloe+3L" },
      { id: 9, name: "Extra+ Citron 3L", category: "Liquide vaisselle", price: "12,500dt", rating: 5, image: "https://placehold.co/200x250/D3D3D3/000?text=Citron+3L" },
      { id: 10, name: "Extra+ Pomme 3L", category: "Liquide vaisselle", price: "12,500dt", rating: 5, image: "https://placehold.co/200x250/32CD32/FFF?text=Pomme+3L" },
    ];
  } else if (category === 'desodorisants') {
    filters = [
      { title: 'Catégorie', options: ['Désodorisant', 'Oudh Al Majles', 'Rafraîchissant', 'Spray tissu', 'Parfums d\'ambiance'] },
      { title: 'Usage', options: ['Voiture', 'Salle de bain', 'Tissus', 'Sols', 'Intérieur (maison)', 'Vêtement'] },
      { title: 'Popularité', options: ['Meilleures ventes', 'Nouveautés', 'Promotions'] },
    ];
    products = [
      { id: 1, name: "Formidable", category: "Fresh Linge", price: "4,200dt", rating: 5, image: "https://placehold.co/150x250/B22222/FFF?text=Formidable" },
      { id: 2, name: "Prestige", category: "Fresh Linge", price: "4,200dt", rating: 5, image: "https://placehold.co/150x250/1E90FF/FFF?text=Prestige" },
      { id: 3, name: "Été", category: "Fresh Linge", price: "5,100dt", rating: 5, image: "https://placehold.co/150x250/9370DB/FFF?text=Ete" },
      { id: 4, name: "Amigo", category: "Fresh Linge", price: "4,200dt", rating: 5, image: "https://placehold.co/150x250/FF1493/FFF?text=Amigo" },
      { id: 5, name: "Top", category: "Air Freshener", price: "4,200dt", rating: 5, image: "https://placehold.co/150x250/20B2AA/FFF?text=Top" },
      { id: 6, name: "C.Doux", category: "Parfum de Linge", price: "5,500dt", rating: 5, image: "https://placehold.co/100x200/DAA520/FFF?text=C.Doux" },
      { id: 7, name: "C.Oud", category: "Parfum de Linge", price: "5,500dt", rating: 5, image: "https://placehold.co/100x200/2E8B57/FFF?text=C.Oud" },
      { id: 8, name: "Musk", category: "Parfum de Linge", price: "5,500dt", rating: 5, image: "https://placehold.co/100x200/000000/FFF?text=Musk" },
      { id: 9, name: "C.Chic", category: "Parfum de Linge", price: "5,500dt", rating: 5, image: "https://placehold.co/100x200/FF69B4/FFF?text=C.Chic" },
      { id: 10, name: "Hawaï", category: "Air Freshener", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/FF8C00/FFF?text=Hawaii" },
      { id: 11, name: "Ward", category: "Air Freshener", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/98FB98/000?text=Ward" },
      { id: 12, name: "Foll", category: "Air Freshener", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/F5F5F5/000?text=Foll" },
      { id: 13, name: "Ocean", category: "Air Freshener", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/4682B4/FFF?text=Ocean" },
      { id: 14, name: "Oudh Al Majles", category: "Air Freshener", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/8B4513/FFF?text=Oudh" },
      { id: 15, name: "Ambiance", category: "Air Freshener", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/FF69B4/FFF?text=Ambiance" },
      { id: 16, name: "Zahrat El Jabal", category: "Air Freshener", price: "8,900dt", rating: 5, image: "https://placehold.co/180x250/800080/FFF?text=Zahrat" },
      { id: 17, name: "Noud Nouj", category: "Air Freshener", price: "8,900dt", rating: 5, image: "https://placehold.co/180x250/000000/FFF?text=Noud" },
      { id: 18, name: "Sahrat El chamea", category: "Air Freshener", price: "8,900dt", rating: 5, image: "https://placehold.co/180x250/FF1493/FFF?text=Sahrat" },
      { id: 19, name: "El Bahja", category: "Air Freshener", price: "8,900dt", rating: 5, image: "https://placehold.co/180x250/FFD700/000?text=Bahja" },
    ];
  } else {
    // Default (Sol et surface)
    filters = [
      { title: 'Catégorie', options: ['Lave Sol', 'Nettoyant multi-surfaces'] },
      { title: 'Surface', options: ['Carrelage', 'Marbre', 'Parquet'] },
      { title: 'Popularité', options: ['Meilleures ventes', 'Nouveautés', 'Promotions'] },
    ];
    products = [
      { id: 1, name: "Bayadh Thalaj", category: "Lave sol", price: "6,500dt", rating: 5, image: "https://placehold.co/150x250/87CEFA/FFF?text=Bayadh" },
      { id: 2, name: "Samat Sahra", category: "Lave sol", price: "6,500dt", rating: 5, image: "https://placehold.co/150x250/F5DEB3/000?text=Samat" },
      { id: 3, name: "Nour Qamar", category: "Lave sol", price: "6,500dt", rating: 5, image: "https://placehold.co/150x250/FF69B4/FFF?text=Nour" },
      { id: 4, name: "Layali", category: "Lave sol", price: "6,500dt", rating: 5, image: "https://placehold.co/150x250/4B0082/FFF?text=Layali" },
      { id: 5, name: "Nessem el Ghalya", category: "Lave sol", price: "6,500dt", rating: 5, image: "https://placehold.co/150x250/32CD32/FFF?text=Nessem" },
      { id: 6, name: "Sol et surface", category: "Nettoyant multi-usages", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/FF1493/FFF?text=Sol" },
      { id: 7, name: "Sol et surface", category: "Nettoyant multi-usages", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/ADFF2F/000?text=Sol" },
      { id: 8, name: "Sol et surface", category: "Nettoyant multi-usages", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/9370DB/FFF?text=Sol" },
      { id: 9, name: "Sol et surface", category: "Nettoyant multi-usages", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/00BFFF/FFF?text=Sol" },
      { id: 10, name: "Sol et surface", category: "Nettoyant multi-usages", price: "4,500dt", rating: 5, image: "https://placehold.co/150x250/FFD700/FFF?text=Sol" },
    ];
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#fbfcfd]">
      <PageBreadcrumb pageName={formattedCategoryName} />
      
      <div className="max-w-7xl mx-auto w-full px-8 py-10 flex flex-col md:flex-row gap-8">
        <CategorySidebar filters={filters} />
        <CategoryProductGrid products={products} />
      </div>
    </div>
  );
}

export default CategoryPage;
