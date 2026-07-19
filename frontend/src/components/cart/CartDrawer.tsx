import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, subtotal } = useCart()

  if (!isCartOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 transition-opacity"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white z-50 shadow-2xl transform transition-transform flex flex-col">
        {/* Header */}
        <div className="bg-[#0033cc] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Mon panier</h2>
          <button 
            onClick={closeCart}
            className="w-8 h-8 flex justify-center items-center rounded border border-white hover:bg-white hover:text-red-600 transition-colors bg-red-600"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5 hover:stroke-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-gray-800 mb-6 font-medium">Votre panier actuel :</p>

          <div className="flex flex-col gap-6 mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="w-20 h-20 border border-gray-200 rounded-lg p-2 flex-shrink-0 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-xs font-bold flex items-center justify-center rounded-full">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-600 text-md mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                  <p className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(3)}DT</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
            <span className="font-bold text-gray-800">Sous-total</span>
            <span className="font-bold text-red-600 text-lg">{subtotal.toFixed(3)}DT</span>
          </div>

          <Link 
            to="/panier"
            onClick={closeCart}
            className="block w-full text-center bg-[#0033cc] hover:bg-blue-800 text-white font-bold py-3 rounded-full transition-colors"
          >
            Commander
          </Link>
        </div>
      </div>
    </>
  )
}

export default CartDrawer
