import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./pages/home";
import AdminPanel from "./pages/CrudsParaAdmin/admin";
import AprendizPanel from "./pages/CrudsParaAdmin/aprendiz";
import ProtectedRoute from "./Protector/ProtectedRoute";
import React from "react";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública para el Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas para todos (aprendiz, funcionario, administrador, instructor) */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "aprendiz",
                "funcionario",
                "administrador",
                "instructor",
              ]}
            />
          }
        >
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Ruta protegida solo para administradores */}
        <Route element={<ProtectedRoute allowedRoles={["administrador"]} />}>
          <Route path="/aprendiz" element={<AprendizPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
