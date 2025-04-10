// components/aprendiz/HistorialAsistencia.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { green } from "@mui/material/colors";

interface Asistencia {
  fecha_asistencia: string;
  nombre_tipo_asistencia: string;
}

const HistorialAsistencia: React.FC = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/panel-aprendiz", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.historial)) {
          setAsistencias(data.historial);
        } else {
          console.warn("La propiedad 'historial' no es un array:", data);
        }
      })
      .catch((err) => {
        console.error("Error al obtener la asistencia:", err);
      });
  }, []);

  return (
    <Box sx={{ maxWidth: "800px", margin: "2rem auto" }}>
      <Paper
        elevation={4}
        sx={{
          padding: "2rem",
          borderRadius: "12px",
          background: "#f9fbe7",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, color: "#558b2f" }}
        >
          <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Historial de Asistencia
        </Typography>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#dcedc8" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>📅 Fecha</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Tipo de Asistencia
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asistencias.map((asistencia, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f1f8e9" : "white",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "#e6ee9c",
                    },
                  }}
                >
                  <TableCell>
                    {new Date(asistencia.fecha_asistencia).toLocaleDateString(
                      "es-CO",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </TableCell>

                  <TableCell>{asistencia.nombre_tipo_asistencia}</TableCell>
                </TableRow>
              ))}
              {asistencias.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ py: 3, color: "#888" }}
                  >
                    No hay asistencias registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default HistorialAsistencia;
