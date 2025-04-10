// src/pages/AsignarInstructorFicha.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import React from "react";

const AsignarInstructorFicha = () => {
  const [instructores, setInstructores] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [idInstructor, setIdInstructor] = useState("");
  const [idFicha, setIdFicha] = useState("");
  const [alerta, setAlerta] = useState({
    open: false,
    mensaje: "",
    tipo: "success",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const obtenerDatos = async () => {
    try {
      const [resInstructores, resFichas] = await Promise.all([
        axios.get("http://localhost:8000/instructoresAIF", { headers }),
        axios.get("http://localhost:8000/fichaAIF", { headers }),
      ]);

      setInstructores(resInstructores.data.instructorActivo);
      setFichas(resFichas.data.fichaActiva);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const handleAsignar = async () => {
    if (!idInstructor || !idFicha) {
      setAlerta({
        open: true,
        mensaje: "Debes seleccionar tanto un instructor como una ficha.",
        tipo: "warning",
      });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/asignarAIF",
        {
          idFuncionario: Number(idInstructor),
          idFicha: Number(idFicha),
        },
        { headers }
      );

      setAlerta({
        open: true,
        mensaje: res.data.msg,
        tipo: res.data.success ? "success" : "info",
      });

      // Limpiar selección
      setIdInstructor("");
      setIdFicha("");
    } catch (error: any) {
      const mensaje =
        error.response?.data?.msg || "Error al asignar instructor.";
      setAlerta({ open: true, mensaje, tipo: "error" });
    }
  };
  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        bgcolor: "#e8f5e9", // verde muy claro de fondo
        boxShadow: 4,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#1b5e20", // verde oscuro
          fontWeight: "bold",
          mb: 3,
        }}
      >
        Asignar Instructor a Ficha
      </Typography>

      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel sx={{ color: "#2e7d32" }}>Instructor</InputLabel>
        <Select
          value={idInstructor}
          onChange={(e) => setIdInstructor(e.target.value)}
          label="Instructor"
          sx={{
            bgcolor: "white",
            borderRadius: 1,
          }}
        >
          {instructores.map((inst) => (
            <MenuItem key={inst.idfuncionario} value={inst.idfuncionario}>
              {inst.nombres} {inst.apellidos} - {inst.documento}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel sx={{ color: "#2e7d32" }}>Ficha</InputLabel>
        <Select
          value={idFicha}
          onChange={(e) => setIdFicha(e.target.value)}
          label="Ficha"
          sx={{
            bgcolor: "white",
            borderRadius: 1,
          }}
        >
          {fichas.map((ficha) => (
            <MenuItem key={ficha.idficha} value={ficha.idficha}>
              {ficha.codigo_ficha} - {ficha.estado_ficha}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        onClick={handleAsignar}
        sx={{
          mt: 3,
          bgcolor: "#43a047",
          "&:hover": {
            bgcolor: "#388e3c",
          },
          fontWeight: "bold",
        }}
      >
        Asignar
      </Button>

      <Snackbar
        open={alerta.open}
        autoHideDuration={5000}
        onClose={() => setAlerta({ ...alerta, open: false })}
      >
        <Alert
          onClose={() => setAlerta({ ...alerta, open: false })}
          severity={alerta.tipo as any}
          sx={{ width: "100%" }}
        >
          {alerta.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AsignarInstructorFicha;
