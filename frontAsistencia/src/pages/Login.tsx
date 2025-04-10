import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Container,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Avatar,
} from "@mui/material";
import axios from "axios";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
  const [openModal, setOpenModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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

  const handlePasswordRecovery = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/postVerificarCorreo",
        {
          user: recoveryEmail,
        }
      );

      console.log("Respuesta de recuperación:", response.data); // DEBUG

      // Asegura que haya un mensaje por defecto SIEMPRE
      const mensaje =
        response.data?.message?.trim() !== ""
          ? response.data.message
          : "Correo enviado correctamente. Revisa tu bandeja de entrada.";

      setSnackbarMessage(mensaje);
      setSnackbarOpen(true);
      setOpenModal(false);
      setRecoveryEmail("");
    } catch (error: any) {
      setSnackbarMessage(
        error.response?.data?.message || "Error al verificar el correo"
      );
      setSnackbarOpen(true);
    }
  };
  return (
    <>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            zIndex: 1,
          }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 2,
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
                  onClick={() => handleLogin("aprendiz")}
                >
                  Ingresar como Aprendiz
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 1,
                    borderColor: "#1b5e20",
                    color: "#1b5e20",
                    "&:hover": {
                      borderColor: "#145417",
                      color: "#145417",
                      backgroundColor: "rgba(27, 94, 32, 0.08)",
                    },
                  }}
                  onClick={() => handleLogin("funcionario")}
                >
                  Ingresar como Funcionario
                </Button>

                <Box sx={{ mt: 2 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setOpenModal(true)}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Modal de recuperación */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Recuperar contraseña</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Ingresa tu correo"
            variant="outlined"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handlePasswordRecovery}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
