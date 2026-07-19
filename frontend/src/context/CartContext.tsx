import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface CartItem {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  image: string
  inStock: boolean
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, delta: number) => void
  subtotal: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  lastAddedItem: CartItem | null
  clearCart: () => void
  appliedPromo: { code: string; discountValue: number } | null
  applyPromo: (code: string, discountValue: number) => void
  removePromo: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('amena-cart')
    if (savedCart) {
      try {
        return JSON.parse(savedCart)
      } catch (e) {
        return []
      }
    }
    return []
  })
  
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null)
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountValue: number } | null>(null)

  useEffect(() => {
    localStorage.setItem('amena-cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (newItem: CartItem) => {
    setLastAddedItem(newItem)
    setCartItems(prev => {
      const existing = prev.find(item => item.id === newItem.id)
      if (existing) {
        return prev.map(item => 
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }
      return [...prev, newItem]
    })
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ))
  }

  const clearCart = () => {
    setCartItems([])
    setAppliedPromo(null)
  }

  const applyPromo = (code: string, discountValue: number) => {
    setAppliedPromo({ code, discountValue })
  }

  const removePromo = () => {
    setAppliedPromo(null)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      lastAddedItem,
      clearCart,
      appliedPromo,
      applyPromo,
      removePromo
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
