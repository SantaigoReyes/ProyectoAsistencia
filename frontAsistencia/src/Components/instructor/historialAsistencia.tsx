import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";
import { format } from "date-fns";

const HistorialAsistencias = () => {
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [idPrograma, setIdPrograma] = useState("");
  const [programas, setProgramas] = useState<any[]>([]);
  const [asistencias, setAsistencias] = useState<any[]>([]);
  const [errorProgramas, setErrorProgramas] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  // Cargar programas al inicio
  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const res = await axios.get("http://localhost:8000/programa", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Respuesta de programas:", res.data);

        if (res.data && Array.isArray(res.data.program)) {
          setProgramas(res.data.program);
        } else {
          throw new Error("Formato inesperado de respuesta");
        }
      } catch (error: any) {
        console.error("Error al cargar programas", error);
        setErrorProgramas(
          error?.response?.data?.message ||
            "No se pudieron cargar los programas"
        );
      }
    };

    fetchProgramas();
  }, [token]);

  // Buscar asistencias filtradas
  const handleBuscar = async () => {
    if (!fechaInicio || !fechaFin || !idPrograma) return;

    try {
      const res = await axios.post(
        "http://localhost:8000/filtroFP",
        {
          fechaInicio: format(fechaInicio, "yyyy-MM-dd"),
          fechaFin: format(fechaFin, "yyyy-MM-dd"),
          idPrograma: parseInt(idPrograma),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAsistencias(res.data.result); // 👈 esta es la solución
      console.log("Datos recibidos del backend:", res.data.result);
    } catch (error) {
      console.error("Error al buscar asistencias:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 4, backgroundColor: "#f4f6f5", minHeight: "100vh" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#004118", // Verde oscuro SENA
            mb: 4,
          }}
        >
          Historial de Asistencias
        </Typography>

        {errorProgramas && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorProgramas}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <DatePicker
            label="Fecha Inicio"
            value={fechaInicio}
            onChange={(newValue) => setFechaInicio(newValue)}
            slotProps={{
              textField: {
                variant: "outlined",
                sx: { backgroundColor: "white", borderRadius: 2 },
              },
            }}
          />
          <DatePicker
            label="Fecha Fin"
            value={fechaFin}
            onChange={(newValue) => setFechaFin(newValue)}
            slotProps={{
              textField: {
                variant: "outlined",
                sx: { backgroundColor: "white", borderRadius: 2 },
              },
            }}
          />
          <FormControl
            sx={{ minWidth: 200, backgroundColor: "white", borderRadius: 2 }}
          >
            <InputLabel id="programa-label">Programa</InputLabel>
            <Select
              labelId="programa-label"
              value={idPrograma}
              onChange={(e) => setIdPrograma(e.target.value)}
              label="Programa"
            >
              {programas.map((programa) => (
                <MenuItem key={programa.idprograma} value={programa.idprograma}>
                  {programa.nombre_programa}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleBuscar}
            sx={{
              backgroundColor: "#007A33", // Verde institucional SENA
              ":hover": { backgroundColor: "#005f27" },
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            Buscar
          </Button>
        </Box>

        {asistencias.length > 0 && (
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#007A33" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Tipo
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Aprendiz
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Ficha
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Programa
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asistencias.map((a) => (
                  <TableRow key={a.idasistencia} hover>
                    <TableCell>
                      {format(new Date(a.fecha_asistencia), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontWeight: "bold",
                          textTransform: "capitalize",
                          color:
                            a.nombre_tipo_asistencia === "Presente"
                              ? "#007A33"
                              : a.nombre_tipo_asistencia === "Tardanza"
                              ? "#f57c00"
                              : a.nombre_tipo_asistencia === "Ausente"
                              ? "#d32f2f"
                              : "#000",
                        }}
                      >
                        {a.nombre_tipo_asistencia === "Presente" && (
                          <CheckCircleIcon />
                        )}
                        {a.nombre_tipo_asistencia === "Tardanza" && (
                          <WarningIcon />
                        )}
                        {a.nombre_tipo_asistencia === "Ausente" && (
                          <CancelIcon />
                        )}
                        {a.nombre_tipo_asistencia}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {a.nombres_aprendiz} {a.apellidos_aprendiz}
                    </TableCell>
                    <TableCell>{a.codigo_ficha}</TableCell>
                    <TableCell>{a.nombre_programa}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
};
export default HistorialAsistencias;
