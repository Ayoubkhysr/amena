import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder, CreateOrderRequest } from '../services/orderService'
import { fetchCoupons } from '../services/couponService'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)

  const { cartItems, updateQuantity, subtotal, clearCart, appliedPromo, applyPromo, removePromo } = useCart()
  
  const [isPromoOpen, setIsPromoOpen] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState<string | null>(null)

  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountValue) / 100 : 0
  const shippingThreshold = 150
  const freeShipping = subtotal >= shippingThreshold
  const shippingCost = subtotal === 0 ? 0 : (shippingMethod === 'standard' ? (freeShipping ? 0 : 8) : 0)
  const total = subtotal - discountAmount + shippingCost

  const handleApplyPromo = async () => {
    try {
      setPromoError(null)
      const coupons = await fetchCoupons()
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const validCoupon = coupons.find(c => {
        if (c.code !== promoInput || !c.isActive) return false
        if (c.expiresAt) {
          const expDate = new Date(c.expiresAt)
          if (expDate < today) return false
        }
        return true
      })
      
      if (validCoupon) {
        if (validCoupon.usageLimit && (validCoupon.usedCount || 0) >= validCoupon.usageLimit) {
          setPromoError("La limite d'utilisation de ce code est atteinte")
        } else {
          applyPromo(validCoupon.code, validCoupon.discountValue)
          setPromoInput('')
          setIsPromoOpen(false)
        }
      } else {
        setPromoError('Code invalide ou expiré')
      }
    } catch (e) {
      setPromoError('Erreur de validation')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleOrderSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (cartItems.length === 0) return

    setIsSubmitting(true)
    try {
      const req: CreateOrderRequest = {
        clientInfo: `Client: ${formData.prenom} ${formData.nom}\nAdresse: ${formData.adresse}, ${formData.ville} ${formData.codePostal}\nTel: ${formData.telephone}`,
        subtotal,
        shippingAmount: shippingCost,
        discountAmount: discountAmount,
        totalAmount: total,
        couponCode: appliedPromo?.code,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      }

      const order = await createOrder(req)
      clearCart()
      setOrderSuccess(order.orderNumber)
    } catch (e) {
      alert("Erreur lors de la création de la commande")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="w-full min-h-[70vh] bg-white flex flex-col items-center justify-center py-20">
        <div className="bg-white p-12 rounded-2xl flex flex-col items-center max-w-lg w-full text-center">
          <div className="w-24 h-24 rounded-full border-2 border-green-500 flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl text-gray-900 mb-4">Votre commande a été complétée avec succès !</h2>
          <p className="text-xl font-bold text-gray-900 mb-8">Commande: #{orderSuccess}</p>
          <Link to="/" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors">
            Continuer vos achats
          </Link>
        </div>
      </div>
    )
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
          <Link to="/panier" className="hover:text-blue-600">
            Panier
          </Link>
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

            <form onSubmit={handleOrderSubmit}>
              {/* Delivery Information Form */}
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom *"
                    required
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                  />
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom *"
                  required
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
              </div>

              <input
                type="text"
                name="adresse"
                placeholder="Adresse *"
                required
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
                  placeholder="Ville *"
                  required
                  value={formData.ville}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
              </div>

              <input
                type="tel"
                name="telephone"
                placeholder="Téléphone *"
                required
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
                    <span className="font-bold">{freeShipping ? "Gratuit" : "8 DT"}</span>
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
            <div className="flex justify-center mb-8 w-full">
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full sm:w-auto px-4 sm:px-12 py-3 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base leading-tight break-words whitespace-normal sm:whitespace-nowrap"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : (
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
                )}
                {isSubmitting ? "Traitement..." : "Acheter maintenant"}
              </button>
            </div>
            </form>

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
              <div className="hidden sm:grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-300">
                <span className="text-sm font-semibold text-gray-600">Article</span>
                <span className="text-sm font-semibold text-gray-600 text-center">Quantité</span>
                <span className="text-sm font-semibold text-gray-600 text-right">Prix</span>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4 sm:items-center pb-4 border-b border-gray-200 sm:border-0 last:border-0">
                    {/* Product Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-16 sm:w-14 sm:h-20 object-contain flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.category}</p>
                        <p className="font-bold text-gray-900 text-sm sm:hidden mt-1">
                          {(item.price * item.quantity).toFixed(3)}DT
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-start sm:justify-center gap-2">
                      <button
                        className="min-w-11 min-h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold hover:bg-blue-200"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="min-w-11 min-h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold hover:bg-blue-200"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-gray-900">
                        {(item.price * item.quantity).toFixed(3)}DT
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
                    {subtotal.toFixed(3)}Dt
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                  <span className="text-sm text-gray-600">Frais de livraison:</span>
                  <div className="text-right font-bold text-gray-900">
                    {subtotal === 0 ? "0.000Dt" : (freeShipping ? "Gratuit" : "8.000Dt")}
                  </div>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                    <span className="text-sm text-green-600 font-semibold">Réduction ({appliedPromo.code}):</span>
                    <span className="text-sm font-bold text-green-600">
                      -{discountAmount.toFixed(3)}Dt
                    </span>
                  </div>
                )}

                {/* Promo Code */}
                <div className="py-4 border-b border-gray-300">
                  {appliedPromo ? (
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200">
                      <div>
                        <span className="text-sm font-semibold text-green-800">Code appliqué: {appliedPromo.code}</span>
                        <p className="text-xs text-green-600">-{appliedPromo.discountValue}% sur vos articles</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removePromo()}
                        className="text-red-500 hover:text-red-700 font-bold p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsPromoOpen(!isPromoOpen)}
                        className="text-sm text-gray-600 flex items-center gap-1 hover:text-blue-600"
                      >
                        <span>Vous avez un code promo ?</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${isPromoOpen ? 'rotate-180' : ''}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      
                      {isPromoOpen && (
                        <div className="mt-3 flex gap-2">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={promoInput}
                              onChange={(e) => setPromoInput(e.target.value)}
                              placeholder="Entrez votre code"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 whitespace-nowrap"
                          >
                            Appliquer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xl font-bold text-gray-900">Montant Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {total.toFixed(3)}Dt
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
