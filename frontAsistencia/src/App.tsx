import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./pages/home";
import AdminPanel from "./Components/Admin/admin";
import ProtectedRoute from "./Protector/ProtectedRoute";
import React from "react";
import NavbarAdmin from "./Components/Admin/navbarAdmin";
import Navbar from "./pages/Dashboard";
import AprendizPanel from "./Components/Admin/aprendiz";
import PanelInstructor from "./Components/instructor/listaAprendicesACargo";
import NavbarInstructor from "./Components/instructor/navbarInstructor";
import HistorialAsistencias from "./Components/instructor/historialAsistencia";
import AdminInstructorPanel from "./Components/Admin/instructor";
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública para el Login */}
        <Route path="/" element={<Login />} />

        {/* Ruta protegida general */}
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

        {/* Aprendiz */}
        <Route element={<ProtectedRoute allowedRoles={["aprendiz"]} />}>
          <Route path="/aprendiz" element={<AdminPanel />} />
        </Route>

        {/* Instructor */}
        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route path="/instructor" element={<NavbarInstructor />} />
          <Route path="/panel-instructor" element={<PanelInstructor />} />
          <Route
            path="/historialAsistencias"
            element={<HistorialAsistencias />}
          />
        </Route>

        {/* Administrador */}
        <Route element={<ProtectedRoute allowedRoles={["administrador"]} />}>
          <Route path="/admin" element={<NavbarAdmin />} />
          <Route path="/crudAdmin" element={<AdminPanel />} />
          <Route path="/aprendices" element={<AprendizPanel />} />
          <Route path="/instructorAdmin" element={<AdminInstructorPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
