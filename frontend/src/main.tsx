import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { StoreProvider } from './context/StoreContext'
import { CartProvider } from './context/CartContext'
import HomePage from './pages/HomePage'
import AdminDashboardPage from './pages/admin/admincomments/AdminDashboardPage'
import StaticPageView from './pages/StaticPageView'
import MainLayout from './layouts/MainLayout'
import ProduitsPage from './pages/ProduitsPage'
import CategoryPage from './pages/CategoryPage'
import AllProductsPage from './pages/AllProductsPage'
import AboutPage from './pages/AboutPage'
import NosMagasinsPage from './pages/NosMagasinsPage'
import PanierPage from './pages/PanierPage'
import LivraisonPage from './pages/LivraisonPage'
import ProductDetailsPage from './pages/ProductDetailsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/produits',
        element: <ProduitsPage />,
      },
      {
        path: '/tous-les-produits',
        element: <AllProductsPage />,
      },
      {
        path: '/produits/:category',
        element: <CategoryPage />,
      },
      {
        path: '/a-propos',
        element: <AboutPage />,
      },
      {
        path: '/nos-magasins',
        element: <NosMagasinsPage />,
      },
      {
        path: '/panier',
        element: <PanierPage />,
      },
      {
        path: '/livraison',
        element: <LivraisonPage />,
      },
      {
        path: '/produit/:id',
        element: <ProductDetailsPage />,
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminDashboardPage />,
  },
  {
    path: '/:slug',
    element: <StaticPageView />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </StoreProvider>
  </StrictMode>,
)