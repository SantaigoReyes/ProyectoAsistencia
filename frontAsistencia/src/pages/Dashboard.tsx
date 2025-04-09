import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // navegación entre páginas
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material"; // iconos desplegados

// Definición de constante para el ancho del Drawer
const drawerWidth = 240;

const Navbar: React.FC = () => {
  const navigate = useNavigate(); // cambio de ruta
  const [usuarioOpen, setUsuarioOpen] = useState<boolean>(false); // Estado para manejar la apertura/cierre de los sub-menús

  const handleUsuarioClick = () => {
    setUsuarioOpen(!usuarioOpen); // alterna entre abierto y cerrado
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        // Estilos de la barra
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "pink", // Color de fondo rosado
          color: "black", // Color del texto en blanco
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ color: "white" }}>
          Mi Tienda
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: "auto" }}>
        <List>
          {/* Ítem de Productos */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/categorias")}>
              <ListItemText primary="LISTA DE APRENDICES A CARGO" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/ingles")}>
              <ListItemText primary="MARCAR ASISTENCIA" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/productos")}>
              <ListItemText primary="HIATORIAL CON FILTROS" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Navbar;
