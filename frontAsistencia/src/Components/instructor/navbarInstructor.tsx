// components/instructor/navbar.tsx
import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

const drawerWidth = 240;

const NavbarInstructor: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "pink",
            color: "black",
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
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/panel-instructor")}>
                <ListItemText primary="LISTA DE APRENDICES A CARGO" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/asistencia")}>
                <ListItemText primary="MARCAR ASISTENCIA" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/historialAsistencias")}>
                <ListItemText primary="HISTORIAL CON FILTROS" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Este es el contenedor del contenido que cambia */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* para dar espacio debajo del AppBar */}
        <Outlet /> {/* Aquí se renderizarán los hijos como el AttendanceForm */}
      </Box>
    </Box>
  );
};

export default NavbarInstructor;
