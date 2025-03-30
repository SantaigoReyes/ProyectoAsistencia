import { Container, Typography, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const goToAdminPanel = () => {
    navigate("/admin"); // Redirige al panel de administración
  };

  return (
    <Container sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4">Bienvenido</Typography>
      <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={handleLogout}>
        Cerrar Sesión
      </Button>

      {/* Este botón se muestra si el usuario quiere acceder al panel de administración */}
      <Button variant="outlined" sx={{ mt: 2 }} onClick={goToAdminPanel}>
        Ir al Panel de Administración
      </Button>
    </Container>
  );
}
