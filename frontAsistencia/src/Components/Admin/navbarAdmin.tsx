import React, { useState, useEffect } from "react";
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
  IconButton,
  AppBar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import senaLogo from "../../assets/sena-logo.png";

const drawerWidth = 240;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [nombreAdmin, setNombreAdmin] = useState("");

  useEffect(() => {
    const usuario = localStorage.getItem("nombre") || "Administrador";
    setNombreAdmin(usuario);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const drawer = (
    <Box sx={{ backgroundColor: "#155724", height: "100%", color: "white" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <img src={senaLogo} alt="SENA Logo" style={{ height: 60 }} />
      </Toolbar>
      <List>
        {[
          { text: "Programa", route: "/admin/crudAdmin" },
          { text: "Aprendices", route: "/admin/aprendices" },
          { text: "Instructor", route: "/admin/instructorAdmin" },
          { text: "Fichas", route: "/admin/fichaAdmin" },
          { text: "asignarI", route: "/admin/asignarInstrucoresAficha" },
        ].map(({ text, route }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate(route)}>
              <ListItemText primary={text} sx={{ pl: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      {/* AppBar superior */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: 80,
          justifyContent: "center",
          backgroundColor: "#19692c",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center", width: "100%" }}
          >
            Bienvenido, {nombreAdmin}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ position: "absolute", right: 20 }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral permanente */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#155724",
              color: "white",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: "#f5f5f5",
            minHeight: "calc(100vh - 80px - 50px)",
          }}
        >
          <Toolbar /> {/* espacio para el AppBar */}
          <Outlet />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          height: 50,
          backgroundColor: "#155724",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body2">
          © 2025 SENA. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Navbar;
