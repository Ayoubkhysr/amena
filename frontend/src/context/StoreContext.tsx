import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { fetchCategories, toUiCategory } from '../services/categoryService'
import { fetchProducts, toUiProduct } from '../services/productService'
import { Banner, StaticPage } from '../pages/admin/admincontenu/AdminContenu'

export type Category = {
  id: string
  name: string
  slug?: string
}

export type Product = {
  id: string
  sku?: string
  slug?: string
  name: string
  category: string
  price: number
  stock: number
  status: 'Actif' | 'Inactif' | 'Rupture'
  imageUrl?: string
  description?: string
  /** Local file selected in the admin form; uploaded after product save. */
  pendingImageFile?: File
}

type StoreContextType = {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  banners: Banner[]
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>
  staticPages: StaticPage[]
  setStaticPages: React.Dispatch<React.SetStateAction<StaticPage[]>>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const MOCK_BANNERS: Banner[] = [
  { id: 'B1', title: 'Promo Printemps', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1200', targetUrl: '/promotions', position: 1, status: 'Actif' },
  { id: 'B2', title: 'Nouveautés Hygiène', imageUrl: 'https://images.unsplash.com/photo-1527515637-eed60c49bcbf?auto=format&fit=crop&q=80&w=1200', targetUrl: '/nouveautes', position: 2, status: 'Actif' },
  { id: 'B3', title: 'Destockage', imageUrl: '', targetUrl: '/destockage', position: 3, status: 'Inactif' },
]

const MOCK_PAGES: StaticPage[] = [
  { id: 'P1', title: 'À propos de nous', slug: 'a-propos', lastModified: '2026-03-15', status: 'Publiée' },
  { id: 'P2', title: 'Conditions Générales de Vente', slug: 'cgv', lastModified: '2026-01-10', status: 'Publiée' },
  { id: 'P3', title: 'Mentions Légales', slug: 'mentions-legales', lastModified: '2026-01-10', status: 'Publiée' },
  { id: 'P4', title: 'Politique de Retour', slug: 'retours', lastModified: '2026-04-05', status: 'Brouillon' },
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS)
  const [staticPages, setStaticPages] = useState<StaticPage[]>(MOCK_PAGES)

  useEffect(() => {
    async function loadStore() {
      try {
        const apiCategories = await fetchCategories()
        const uiCategories = apiCategories.map(toUiCategory)
        setCategories(uiCategories)

        const apiProducts = await fetchProducts()
        setProducts(apiProducts.map((product) => toUiProduct(product, uiCategories)))
      } catch (error) {
        console.warn('Impossible de charger les données depuis l\'API:', error)
      }
    }

    loadStore()
  }, [])

  return (
    <StoreContext.Provider value={{
      products, setProducts,
      categories, setCategories,
      banners, setBanners,
      staticPages, setStaticPages,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}
