// src/pages/PanelInstructor.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PanelInstructor = () => {
  const [fichas, setFichas] = useState<any[]>([]);
  const [aprendicesPorFicha, setAprendicesPorFicha] = useState<{
    [key: number]: any[];
  }>({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchFichas = async () => {
    try {
      const res = await axios.get("http://localhost:8000/fichas-instructor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFichas(res.data.fichas);
    } catch (error) {
      console.error("Error al obtener fichas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAprendices = async (idficha: number) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/aprendices-por-ficha?idFicha=${idficha}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAprendicesPorFicha((prev) => ({
        ...prev,
        [idficha]: res.data.aprendices,
      }));
    } catch (error) {
      console.error("Error al obtener aprendices:", error);
    }
  };

  useEffect(() => {
    fetchFichas();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Panel de Aprendices por Ficha
      </Typography>

      {fichas.map((ficha) => (
        <Accordion
          key={ficha.idficha}
          onChange={(_, expanded) => {
            if (expanded && !aprendicesPorFicha[ficha.idficha]) {
              fetchAprendices(ficha.idficha);
            }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography fontWeight="bold">{ficha.nombre_programa}</Typography>
              <Typography>Ficha: {ficha.codigo_ficha}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {aprendicesPorFicha[ficha.idficha] ? (
              <Box sx={{ overflowX: "auto", mt: 2 }}>
                <Table sx={{ minWidth: 800, borderRadius: 2, boxShadow: 2 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#003366" }}>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Nombres
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Apellidos
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Tipo Doc
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Abreviatura
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Documento
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Correo
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Teléfono
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Estado
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {aprendicesPorFicha[ficha.idficha].map(
                      (aprendiz, index) => (
                        <TableRow
                          key={aprendiz.idaprendiz}
                          sx={{
                            backgroundColor:
                              index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                            "&:hover": { backgroundColor: "#e3f2fd" },
                          }}
                        >
                          <TableCell>{aprendiz.nombres_aprendiz}</TableCell>
                          <TableCell>{aprendiz.apellidos_aprendiz}</TableCell>
                          <TableCell>{aprendiz.tipo_documento}</TableCell>
                          <TableCell>
                            {aprendiz.abreviatura_documento}
                          </TableCell>
                          <TableCell>{aprendiz.documento_aprendiz}</TableCell>
                          <TableCell>{aprendiz.email_aprendiz}</TableCell>
                          <TableCell>{aprendiz.telefono_aprendiz}</TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                color:
                                  aprendiz.estado_aprendiz === "En Formación"
                                    ? "#2e7d32"
                                    : aprendiz.estado_aprendiz === "Certificado"
                                    ? "#1565c0"
                                    : aprendiz.estado_aprendiz === "Cancelado"
                                    ? "#c62828"
                                    : aprendiz.estado_aprendiz === "Retirado"
                                    ? "#616161"
                                    : aprendiz.estado_aprendiz === "Aplazado"
                                    ? "#ef6c00"
                                    : aprendiz.estado_aprendiz === "Reprobado"
                                    ? "#6a1b9a"
                                    : "#000", // color por defecto si no coincide
                              }}
                            >
                              {aprendiz.estado_aprendiz}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Typography variant="body2">Cargando aprendices...</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default PanelInstructor;
