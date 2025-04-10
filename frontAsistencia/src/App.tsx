// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./Components/Admin/admin";
import ProtectedRoute from "./Protector/ProtectedRoute";
import React from "react";
import NavbarAdmin from "./Components/Admin/navbarAdmin";
import PanelInstructor from "./Components/instructor/listaAprendicesACargo";
import NavbarInstructor from "./Components/instructor/navbarInstructor";
import HistorialAsistencias from "./Components/instructor/historialAsistencia";
import AdminInstructorPanel from "./Components/Admin/instructor";
import AdminFichaPanel from "./Components/Admin/fichas";
import AprendicesPanel from "./Components/Admin/aprendiz";
import ResetPassword from "./pages/resetPassword";
import HistorialAsistencia from "./Components/aprendiz/panelAprendiz";
import AsistenciaForm from "./Components/instructor/asistenciaAprendiz";
import AsignarInstructor from "./Components/Admin/instructor";
import AsignarInstructorFicha from "./Components/Admin/asignarInstructorAFicha";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública para el Login */}
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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
        ></Route>

        {/* Aprendiz */}
        <Route element={<ProtectedRoute allowedRoles={["aprendiz"]} />}>
          <Route path="/aprendiz" element={<HistorialAsistencia />} />
        </Route>

        {/* Instructor */}
        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route path="/instructor" element={<NavbarInstructor />}>
            <Route path="panel-instructor" element={<PanelInstructor />} />
            <Route path="asistencia" element={<AsistenciaForm />} />
            <Route
              path="historialAsistencias"
              element={<HistorialAsistencias />}
            />
          </Route>
        </Route>
        {/* Administrador */}
        <Route element={<ProtectedRoute allowedRoles={["administrador"]} />}>
          <Route path="/admin" element={<NavbarAdmin />}>
            <Route path="crudAdmin" element={<AdminPanel />} />
            <Route path="aprendices" element={<AprendicesPanel />} />
            <Route path="instructorAdmin" element={<AdminInstructorPanel />} />
            <Route path="fichaAdmin" element={<AdminFichaPanel />} />
            <Route
              path="asignarInstrucoresAficha"
              element={<AsignarInstructorFicha />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
