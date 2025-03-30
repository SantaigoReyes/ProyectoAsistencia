import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Container,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

export interface LoginResponse {
  token: string;
  msg: string;
  usuario: {
    id: number;
    nombres: string;
    roles?: string[]; // Array de roles
    role?: string;
  };
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (tipo: "aprendiz" | "funcionario") => {
    try {
      const response = await axios.post<LoginResponse>(
        `http://localhost:8000/login/${tipo}`,
        { email, password }
      );

      alert(response.data.msg);

      // Guardamos el token
      localStorage.setItem("token", response.data.token);
      // Usamos el primer rol del array "roles" si existe; de lo contrario, se queda en ""
      const userRole = response.data.usuario.roles
        ? response.data.usuario.roles[0]
        : "";
      localStorage.setItem("role", userRole);

      console.log("Rol recibido:", userRole);

      // Redirige según el rol
      // Por ejemplo, si es "administrador" se va a /admin, si es "instructor" a /instructor, y los demás a /home
      if (userRole.toLowerCase() === "administrador") {
        navigate("/admin", { replace: true });
      } else if (userRole.toLowerCase() === "instructor") {
        navigate("/instructor", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error: any) {
      alert(error.response?.data?.msg || "Error en el inicio de sesión");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/image/Kawasaki_Z400.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(3px)",
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Iniciar Sesión
            </Typography>
            <TextField
              fullWidth
              label="Correo Electrónico"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: "#1976d2", color: "white" }}
              onClick={() => handleLogin("aprendiz")}
            >
              Ingresar como Aprendiz
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => handleLogin("funcionario")}
            >
              Ingresar como Funcionario
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
