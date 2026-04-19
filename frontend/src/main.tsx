import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { StoreProvider } from './context/StoreContext'
import AdminDashboardPage from './pages/admin/admincomments/AdminDashboardPage'
import StaticPageView from './pages/StaticPageView'

const router = createBrowserRouter([
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