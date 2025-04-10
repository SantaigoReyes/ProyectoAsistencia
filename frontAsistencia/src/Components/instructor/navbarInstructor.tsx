import React from "react";
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
  AppBar,
  IconButton,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const NavbarInstructor: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // o la forma que uses para autenticar
    navigate("/"); // redirige al login o inicio
  };

  const drawer = (
    <Box sx={{ backgroundColor: "#33691e", height: "100%", color: "white" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6" sx={{ color: "white" }}>
          Instructor
        </Typography>
      </Toolbar>
      <List>
        {[
          {
            text: "Lista de Aprendices",
            route: "/instructor/panel-instructor",
            icon: <GroupIcon sx={{ mr: 1 }} />,
          },
          {
            text: "Marcar Asistencia",
            route: "/instructor/asistencia",
            icon: <AccessTimeIcon sx={{ mr: 1 }} />,
          },
          {
            text: "Historial con Filtros",
            route: "/instructor/historialAsistencias",
            icon: <ListAltIcon sx={{ mr: 1 }} />,
          },
        ].map(({ text, route, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate(route)}>
              {icon}
              <ListItemText primary={text} sx={{ pl: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar superior */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#558b2f",
          boxShadow: 3,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Bienvenido Instructor
          </Typography>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="inherit"
            startIcon={<LogoutIcon />}
            sx={{ borderColor: "#fff", color: "#fff" }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#33691e",
            color: "white",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Espaciado para AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default NavbarInstructor;
