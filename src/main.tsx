import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import NotFound from './routes/NotFound';
import Home from './routes/Home';
import Sobre from './routes/Sobre';
import CentralAjuda from './routes/CentralAjuda';
import Login from './routes/Login';
import Cadastro from './routes/Cadastro';
import { ThemeProvider } from './context/ThemeContext';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <NotFound />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/sobre", element: <Sobre /> },
        { path: "/central-ajuda", element: <CentralAjuda /> },
        { path: "/login", element: <Login /> },
        { path: "/cadastro", element: <Cadastro /> },
      ],
    },
    // {
    //   path: "/profissional/:id", 
    //   element: <ProfissionalLayout />,
    //   errorElement: <NotFound />,
    // },
  ],
  // { basename: import.meta.env.BASE_URL }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
