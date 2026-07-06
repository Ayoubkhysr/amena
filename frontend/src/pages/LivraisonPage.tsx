import { useState } from 'react'
import { Link } from 'react-router-dom'

interface CartItem {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  image: string
}

function LivraisonPage() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    telephone: '',
  })

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('livraison')

  const cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Ezzahra',
      category: 'Gel machine automatique',
      price: 174000,
      quantity: 12,
      image: '/images/ffffffffff 1.png',
    },
    {
      id: 2,
      name: 'Extra +',
      category: 'Liquide vaisselle',
      price: 105000,
      quantity: 12,
      image: '/images/rect.png',
    },
  ]

  const updateQuantity = (id: number, delta: number) => {
    // Logic to update quantity
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = shippingMethod === 'standard' ? 8000 : 0
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
          <span className="font-semibold text-gray-900">Paiement</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Forms */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Livraison</h1>

            {/* Delivery Information Form */}
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
              </div>

              <input
                type="text"
                name="adresse"
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="codePostal"
                  placeholder="Code Postal / facultatif"
                  value={formData.codePostal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="ville"
                  placeholder="Ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
              </div>

              <input
                type="tel"
                name="telephone"
                placeholder="Téléphone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Shipping and Payment Methods */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Mode d'expédition */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Mode d'expédition</h3>
                <button
                  onClick={() => setShippingMethod('standard')}
                  className={`w-full px-4 py-3 rounded-full border-2 transition-colors ${
                    shippingMethod === 'standard'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Frais de Livraison</span>
                    <span className="font-bold">8 DT</span>
                  </div>
                </button>
              </div>

              {/* Paiement */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Paiement</h3>
                <button
                  onClick={() => setPaymentMethod('livraison')}
                  className={`w-full px-4 py-3 rounded-full border-2 transition-colors ${
                    paymentMethod === 'livraison'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="font-medium">Paiement à la livraison</span>
                </button>
              </div>
            </div>

            {/* Buy Now Button */}
            <div className="flex justify-center mb-8">
              <button className="px-12 py-3 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2">
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
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                Acheter maintenant
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-gray-400 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                  />
                </svg>
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Paiement
                  <br />
                  Sécurisé
                </p>
              </div>

              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-gray-400 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Livraison
                  <br />
                  Rapide
                </p>
              </div>

              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-gray-400 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Retour
                  <br />
                  Jusqu'à 14 jours
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-300">
                <span className="text-sm font-semibold text-gray-600">Article</span>
                <span className="text-sm font-semibold text-gray-600 text-center">Quantité</span>
                <span className="text-sm font-semibold text-gray-600 text-right">Prix</span>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-3 gap-4 items-center">
                    {/* Product Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-16 object-contain"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold hover:bg-blue-200"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="font-semibold text-gray-900 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold hover:bg-blue-200"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {(item.price / 1000).toFixed(3)}DT
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 pt-4 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sous-total:</span>
                  <span className="font-bold text-gray-900">
                    {(subtotal / 1000).toFixed(3)}Dt
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                  <span className="text-sm text-gray-600">Frais de port:</span>
                  <div className="text-right">
                    <select className="text-sm text-gray-600 border-none focus:outline-none cursor-pointer bg-transparent">
                      <option>Selon le mode de livraison</option>
                    </select>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="py-4 border-b border-gray-300">
                  <button className="text-sm text-gray-600 flex items-center gap-1 hover:text-blue-600">
                    <span>Vous avez un code promo ?</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xl font-bold text-gray-900">Montant Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {(total / 1000).toFixed(3)}Dt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LivraisonPage
