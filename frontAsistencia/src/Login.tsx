import React, { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export interface LoginResponse {
  token: string;
  msg: string;
  usuario: {
    id: number;
    nombres: string;
    roles?: string[];
    role?: string;
  };
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (tipo: "aprendiz" | "funcionario") => {
    try {
      const { data } = await axios.post<LoginResponse>(
        `http://localhost:8000/login/${tipo}`,
        { email, password }
      );
      alert(data.msg);
      localStorage.setItem("token", data.token);
      const userRole = data.usuario.roles?.[0] ?? "";
      localStorage.setItem("role", userRole);

      if (userRole.toLowerCase() === "administrador") {
        navigate("/admin", { replace: true });
      } else if (userRole.toLowerCase() === "instructor") {
        navigate("/instructor", { replace: true });
      } else if (userRole.toLowerCase() === "aprendiz") {
        navigate("/aprendiz", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err: any) {
      alert(err.response?.data?.msg || "Error en el inicio de sesión");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Ruta relativa dentro de public/
        backgroundImage: "url('/image/Concurso-SENA-2025-portada.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(0, 0, 0, 0.6)", // overlay oscuro
        },
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          position: "relative",
          zIndex: 1, // para que esté encima del overlay
        }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 2,
            // ligero desenfoque y fondo semitransparente
            backdropFilter: "blur(6px)",
            bgcolor: "rgba(255, 255, 255, 0.8)",
            boxShadow: 5,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "#1b5e20" }}>
                <LockOutlinedIcon />
              </Avatar>

              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#1e7e34" }}
              >
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
                sx={{
                  mt: 2,
                  bgcolor: "#1b5e20",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#145417",
                  },
                }}
              >
                Ingresar como Aprendiz
              </Button>

              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 1,
                  borderColor: "#1b5e20", // Verde bosque oscuro
                  color: "#1b5e20",
                  "&:hover": {
                    borderColor: "#145417", // Un tono aún más oscuro
                    color: "#145417",
                    backgroundColor: "rgba(27, 94, 32, 0.08)", // Sutil fondo al pasar el mouse
                  },
                }}
                onClick={() => handleLogin("funcionario")}
              >
                Ingresar como Funcionario
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
