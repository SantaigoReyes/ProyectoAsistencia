// src/pages/ResetPassword.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Llama al endpoint del backend para validar el token
        const res = await axios.get(
          `http://localhost:8000/employees/reset-password?token=${token}`
        );
        if (res.data.success) {
          setEmail(res.data.email);
          setValid(true);
        } else {
          setValid(false);
        }
      } catch (error) {
        console.error("Error validando token:", error);
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/postResetpassword", {
        token,
        password,
      });
      alert(res.data.message);
      if (res.data.success) {
        navigate("/"); // redirige al login
      }
    } catch (error) {
      alert("Error al restablecer la contraseña");
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (!valid)
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error" align="center">
          El token es inválido o ha expirado. Solicita un nuevo enlace.
        </Typography>
      </Container>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 2,
          background: "#ADD8ADFF",
          height: "400px",
        }}
      >
        <Typography variant="h5" align="center" marginTop="50px" gutterBottom>
          Restablecer contraseña
        </Typography>
        <Typography variant="subtitle1" align="center" marginBottom="90px">
          Para: <strong>{email}</strong>
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Nueva contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{ py: 1.5 }}
            style={{ borderRadius: "30px" }}
          >
            Guardar nueva contraseña
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
