import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider} from 'react-router'
import LandingPage from './components/LandingPage'




const routes = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage/>,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes}  />
  </StrictMode>
)
