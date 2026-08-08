import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useCart } from '../context/CartContext'
import { fetchProductById, toUiProduct, fetchProductsPage } from '../services/productService'
import type { Product } from '../context/StoreContext'

function ProductDetailsPage() {
  const { id } = useParams()
  const { categories } = useStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  const { addToCart, openCart } = useCart()

  useEffect(() => {
    async function loadProduct() {
      if (!id) return
      setLoading(true)
      try {
        const apiProduct = await fetchProductById(id)
        const uiProduct = toUiProduct(apiProduct, categories)
        
        // Ensure image URL has a fallback for the UI
        if (!uiProduct.imageUrl) {
          uiProduct.imageUrl = `https://placehold.co/400x400/E5E7EB/A1A1AA?text=${encodeURIComponent(uiProduct.name)}`
        }
        
        setProduct(uiProduct)

        // Try to fetch related products from the same category
        if (apiProduct.categoryId) {
          const relatedPage = await fetchProductsPage(0, 5, undefined, apiProduct.categoryId, undefined, 'createdAt', 'desc', undefined, true)
          const relatedMapped = relatedPage.content
            .filter(p => p.id.toString() !== id)
            .map(p => {
              const uiP = toUiProduct(p, categories)
              return {
                id: p.id,
                name: uiP.name,
                category: uiP.category,
                price: `${uiP.price.toFixed(3)}dt`,
                compareAtPrice: uiP.compareAtPrice ? `${uiP.compareAtPrice.toFixed(3)}dt` : undefined,
                rating: 5,
                image: uiP.imageUrl || `https://placehold.co/150x250/E5E7EB/A1A1AA?text=${encodeURIComponent(uiP.name)}`
              }
            })
            .slice(0, 4) // max 4 items
          
          setRelatedProducts(relatedMapped)
        } else {
           setRelatedProducts([])
        }

      } catch (error) {
        console.error("Failed to load product", error)
      } finally {
        setLoading(false)
      }
    }

    if (categories.length > 0) {
      loadProduct()
    }
  }, [id, categories])

  const updateQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: Number(product.id),
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: quantity,
        image: product.imageUrl || '',
        inStock: product.stock > 0 || product.status === 'Actif'
      })
      openCart()
    }
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen bg-[#fbfcfd]">
        <p className="text-slate-500 font-medium">Chargement du produit...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-screen bg-[#fbfcfd]">
        <p className="text-slate-500 font-medium text-lg mb-4">Produit introuvable.</p>
        <Link to="/produits" className="text-blue-600 hover:underline">Retour aux produits</Link>
      </div>
    )
  }

  const isStockAvailable = product.stock > 0 || product.status === 'Actif'
  const totalPrice = product.price * quantity

  return (
    <div className="w-full min-h-screen bg-[#fbfcfd] font-sans pb-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 pt-4 pb-2 text-xs text-gray-500 font-medium">
        <Link to="/" className="hover:text-blue-600">Accueil</Link>
        <span className="mx-2">&gt;</span>
        <Link to="/produits" className="hover:text-blue-600">Nos Gamme des Produits</Link>
        <span className="mx-2">&gt;</span>
        {product.category && (
          <>
            <Link to={`/produits/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-600">
              {product.category}
            </Link>
            <span className="mx-2">&gt;</span>
          </>
        )}
        <span className="text-gray-900 font-semibold">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column: Product Image Container */}
        <div className="w-full lg:w-[350px] flex-shrink-0 flex justify-center items-center border border-blue-200 rounded-3xl p-6 bg-white h-[350px]">
          <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
        </div>

        {/* Middle Column: Info & Description */}
        <div className="flex-1 w-full flex flex-col">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 uppercase">{product.name}</h1>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Promo</span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-4">{product.category}</p>

          <div className="flex items-center gap-4 mb-6">
            {isStockAvailable && (
              <div className="flex items-center gap-2 border border-green-200 rounded-full px-3 py-1 bg-white">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-xs font-bold text-gray-700 uppercase">EN STOCK</span>
              </div>
            )}
            <div className="flex items-center bg-white">
              <img src="/images/produit tunisien.png" alt="Fabrication Tunisienne" className="h-10 object-contain" />
            </div>
          </div>

          {product.sku && (
            <div className="mb-6">
              <span className="text-gray-500 font-bold text-sm uppercase tracking-wide">Réf : </span>
              <span className="text-gray-900 font-bold text-sm">{product.sku}</span>
            </div>
          )}

          {/* Description Block */}
          <div className="border border-blue-300 rounded-2xl overflow-hidden bg-white w-full">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
              <h3 className="text-blue-700 font-bold text-sm uppercase tracking-wide">DESCRIPTION DU PRODUIT</h3>
            </div>
            <div className="p-5 text-sm text-gray-600 leading-relaxed">
              {product.description || `${product.name} : est un produit spécialement conçu pour votre usage quotidien. Il garantit une qualité irréprochable et répond à toutes vos attentes.`}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Block */}
        <div className="border border-blue-400 rounded-2xl p-6 bg-white w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-24">
          
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-blue-500 font-medium text-sm leading-tight max-w-[80px]">Prix unitaire</span>
            <div className="flex flex-col items-end">
              <span className={`font-bold text-sm ${product.compareAtPrice && product.compareAtPrice > product.price ? 'text-red-600' : 'text-gray-900'}`}>{product.price.toFixed(3)}DT</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">{product.compareAtPrice.toFixed(3)}DT</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <span className="text-blue-500 font-medium text-sm">Quantité</span>
            <div className="flex items-center border border-blue-300 rounded-full px-3 py-1 bg-white">
              <button onClick={() => updateQuantity(-1)} className="text-blue-400 font-light text-lg min-w-8 min-h-8 hover:bg-blue-50 rounded-full flex items-center justify-center">-</button>
              <span className="mx-2 text-blue-500 font-medium min-w-[20px] text-center text-sm">{quantity}</span>
              <button onClick={() => updateQuantity(1)} className="text-blue-400 font-light text-lg min-w-8 min-h-8 hover:bg-blue-50 rounded-full flex items-center justify-center">+</button>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-100 mb-6">
            <span className="text-blue-700 font-bold text-lg">TOTAL</span>
            <span className="text-gray-900 font-extrabold text-lg">{totalPrice.toFixed(3)} DT</span>
          </div>

          <button onClick={handleAddToCart} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm uppercase tracking-wide flex justify-center items-center text-center">
            AJOUTEZ AU PANIER
          </button>
        </div>

      </div>

      {/* Related Products Section */}
      <div className="mt-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-700 mb-10 font-[cursive]">
            Les Clients Qui Ont Acheté Ce Produit Ont Également Acheté...
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <Link to={`/produit/${relProduct.id}`} key={relProduct.id} className="block">
                <div className="bg-white rounded-2xl p-4 flex flex-col items-center hover:shadow-lg transition-shadow border border-blue-200 relative">
                  {relProduct.compareAtPrice && parseFloat(relProduct.compareAtPrice) > parseFloat(relProduct.price) && (
                    <span className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg rounded-tl-lg z-10 shadow-sm uppercase">Promo</span>
                  )}
                  <div className="w-full h-40 sm:h-48 flex justify-center items-center mb-4">
                    <img src={relProduct.image} alt={relProduct.name} className="max-h-full object-contain" />
                  </div>
                  <div className="w-full text-left">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-800 text-sm truncate pr-2">{relProduct.name}</h3>
                      <div className="flex text-yellow-400 flex-shrink-0">
                        {[...Array(relProduct.rating)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{relProduct.category}</p>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${relProduct.compareAtPrice && parseFloat(relProduct.compareAtPrice) > parseFloat(relProduct.price) ? 'text-red-600' : 'text-[#007dd6]'}`}>{relProduct.price}</span>
                      {relProduct.compareAtPrice && parseFloat(relProduct.compareAtPrice) > parseFloat(relProduct.price) && (
                        <span className="text-xs text-gray-400 line-through">{relProduct.compareAtPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
