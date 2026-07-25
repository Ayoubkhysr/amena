import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function PanierPage() {
  const { cartItems, updateQuantity, removeFromCart: removeItem, subtotal } = useCart()

  const shippingThreshold = 150
  const freeShipping = subtotal >= shippingThreshold
  const shippingCost = subtotal === 0 ? 0 : (freeShipping ? 0 : 8)
  const total = subtotal + shippingCost

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="text-xs text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Accueil
          </Link>
          <span className="mx-2">{'>'}</span>
          <Link to="/produits" className="hover:text-blue-600">
            Nos Gammes des Produits
          </Link>
          <span className="mx-2">{'>'}</span>
          <Link to="/produits/lessive" className="hover:text-blue-600">
            Lessive de linge
          </Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-700">Gel machine El Ezzahra</span>
          <span className="mx-2">{'>'}</span>
          <span className="font-semibold text-gray-900">Panier</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PANIER</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Banners Row */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Free Shipping Card */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-red-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">
                    Obtenez la livraison gratuite
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-900 mb-2">150DT</div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all"
                    style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap sm:flex-nowrap items-center gap-4 border border-gray-200 rounded-lg p-4"
              >
                {/* Product Image */}
                <div className="w-16 sm:w-20 h-20 sm:h-28 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-[120px]">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                  {item.inStock && (
                    <div className="flex items-center gap-1 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-600">EN STOCK</span>
                    </div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-blue-500 rounded-full px-2 sm:px-3 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="text-blue-500 font-bold text-lg min-w-11 min-h-11 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="mx-2 sm:mx-3 font-semibold text-gray-900 min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="text-blue-500 font-bold text-lg min-w-11 min-h-11 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-sm sm:text-base">
                    {item.price.toFixed(3)}DT
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 min-w-11 min-h-11 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Right Side - Summary */}
          <div className="lg:col-span-1">
            <div className="border-2 border-blue-400 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">RÉCAPITULATIF</h2>

              {/* Items Count */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} Articles
                </span>
                <span className="font-bold text-gray-900">
                  {subtotal.toFixed(3)}Dt
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="text-sm text-gray-600">Frais de livraison:</span>
                <span className="text-sm font-bold text-gray-900">
                  {subtotal === 0 ? "0.000Dt" : (freeShipping ? "Gratuit" : "8.000Dt")}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">TOTAL</span>
                <span className="text-xl font-bold text-gray-900">
                  {total.toFixed(3)}Dt
                </span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4">
                <Link to="/livraison" className="block w-full">
                  <button type="button" className="w-full bg-white border-2 border-blue-500 text-blue-600 font-bold py-3 rounded-full hover:bg-blue-50 transition-colors">
                    Acheter maintenant
                  </button>
                </Link>
                <Link to="/produits" className="block w-full">
                  <button type="button" className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-colors">
                    Continuer mes achats
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <h2
            className="text-center text-2xl sm:text-3xl font-bold text-blue-600 mb-8 font-[cursive]"
          >
            Les Clients Qui Ont Acheté Ce Produit Ont Également Acheté...
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                name: 'Adoucissant',
                category: 'Lessive linge',
                price: '5.500dt',
                image: '/images/Rectangle 6.png',
                rating: 5,
              },
              {
                id: 2,
                name: 'La famille',
                category: 'Lessive linge',
                price: '27.000dt',
                image: '/images/Rectangle 33 .png',
                rating: 5,
              },
              {
                id: 3,
                name: 'Zahret El Jabal',
                category: 'Désodorisants',
                price: '13.500dt',
                image: '/images/Rectangle 34 (2).png',
                rating: 5,
              },
              {
                id: 4,
                name: 'El Bahja',
                category: 'Nettoyant',
                price: '9.500dt',
                image: '/images/Rectangle 35 (1).png',
                rating: 5,
              },
            ].map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="w-full h-40 sm:h-48 flex justify-center items-center mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(product.rating)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                <p className="font-bold text-blue-600">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanierPage
