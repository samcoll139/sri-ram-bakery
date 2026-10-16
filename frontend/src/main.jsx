import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ProductsProvider>
            <OrderProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </OrderProvider>
          </ProductsProvider>
        </ToastProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
