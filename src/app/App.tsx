// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Páginas
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import RecoverPassword from "../pages/Auth/RecoverPassword";
import Dashboard from "../pages/Client/Dashboard";
import PrivateRoute from "../routes/PrivateRoute";
import Bookings from "../pages/Client/Bookings";
//import Registrar from "./pages/Auth/Registrar";
//import Dashboard from "./pages/Client/Dashboard";
//import Agendamento from "./pages/Client/Agendamento";
//import MinhasReservas from "./pages/Client/MinhasReservas";
//import FilaDeEspera from "./pages/Client/FilaDeEspera";
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
  // {
  //   path: "/agendamento",
  //   element: <Agendamento />,
  // },
  {
    path: "/minhas-reservas",
    element: (
      <PrivateRoute>
        <Bookings />
      </PrivateRoute>
    ),
  },
  // {
  //   path: "/fila-de-espera",
  //   element: <FilaDeEspera />,
  // },
  // {
  //   path: "/admin",
  //   children: [
  //     {
  //       index: true,
  //       element: <Painel />,
  //     },
  //     {
  //       path: "relatorios",
  //       element: <Relatorios />,
  //     },
  //     {
  //       path: "configuracoes",
  //       element: <Configuracoes />,
  //     },
  //   ],
  // },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
