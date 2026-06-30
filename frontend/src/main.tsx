import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { StoreProvider } from './context/StoreContext'
import HomePage from './pages/HomePage'
import AdminDashboardPage from './pages/admin/admincomments/AdminDashboardPage'
import StaticPageView from './pages/StaticPageView'
import MainLayout from './layouts/MainLayout'
import ProduitsPage from './pages/ProduitsPage'
import CategoryPage from './pages/CategoryPage'
import AboutPage from './pages/AboutPage'

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
        path: '/produits/:category',
        element: <CategoryPage />,
      },
      {
        path: '/a-propos',
        element: <AboutPage />,
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
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>,
)