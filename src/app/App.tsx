// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Páginas
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import RecoverPassword from "../pages/Auth/RecoverPassword";
import Dashboard from "../pages/Client/Dashboard";
import PrivateRoute from "../routes/PrivateRoute";
import MyBookings from "../pages/Client/MyBookings";
import NewBooking from "../pages/Client/NewBooking";
import PainelAdmin from "../pages/Admin/PainelAdmin";
import AdminRoute from "../routes/AdminRoute";
import AdminBooking from "../pages/Admin/AdminBooking";
//import Painel from "./pages/Admin/Painel";
//import Relatorios from "./pages/Admin/Relatorios";
//import Configuracoes from "./pages/Admin/Configuracoes";
//import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registrar",
    element: <Register />,
  },
  {
    path: "/recuperar-senha",
    element: <RecoverPassword />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/agendamento",
    element: (
      <PrivateRoute>
        <NewBooking />
      </PrivateRoute>
    ),
  },
  {
    path: "/minhas-reservas",
    element: (
      <PrivateRoute>
        <MyBookings />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    children: [
      {
        index: true,
        element: (
          <AdminRoute>
            <PainelAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/agenda",
        element: (
          <AdminRoute>
            <AdminBooking />
          </AdminRoute>
        )
      }
    ],
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
