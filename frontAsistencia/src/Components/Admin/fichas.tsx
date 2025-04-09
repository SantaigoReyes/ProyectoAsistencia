import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import React from "react";

interface Ficha {
  idficha: number;
  codigo_ficha: string;
  fecha_inicio: string;
  nombre_programa: string;
  estado_ficha: string;
  programa_idprograma?: number;
  estado_ficha_idestado_ficha?: number;
}

interface Programa {
  idprograma: number;
  nombre_programa: string;
}

interface EstadoFicha {
  idestado_ficha: number;
  estado_ficha: string;
}

export default function AdminFichaPanel() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingFicha, setEditingFicha] = useState<Ficha | null>(null);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [estados, setEstados] = useState<EstadoFicha[]>([]);

  const [formFicha, setFormFicha] = useState({
    codigo_ficha: "",
    fecha_inicio: "",
    programa_idprograma: "",
    estado_ficha_idestado_ficha: "", // 👈 string vacío
  });

  const token = localStorage.getItem("token");

  const fetchFichas = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/fichas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFichas(res.data.data);
    } catch (err) {
      setError("No se pudo cargar la lista de fichas.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramas = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const programasRes = await axios.get("http://localhost:8000/programa", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 Respuesta de programas:", programasRes.data);
      // Se asume que la respuesta es un objeto con la propiedad "program"
      setProgramas(programasRes.data.program || programasRes.data || []);
    } catch (error) {
      console.error("❌ Error al obtener los datos:", error);
      setError("No se pudo obtener los datos. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEstados = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8000/estado-ficha", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 Respuesta de estado Ficha:", res.data);

      // Verifica si `res.data.data` existe y es un array
      if (Array.isArray(res.data.data)) {
        setEstados(res.data.data);
      } else {
        setEstados([]); // por si viene mal la respuesta
      }
    } catch (error) {
      console.error("❌ Error al obtener los datos:", error);
      setError("No se pudo obtener los datos. Verifica tu conexión.");
      setEstados([]); // por si falla, vacía la lista
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFichas();
    fetchProgramas();
    fetchEstados();
  }, []);

  const resetForm = () => {
    setFormFicha({
      codigo_ficha: "",
      fecha_inicio: "",
      programa_idprograma: "",
      estado_ficha_idestado_ficha: "",
    });
    setEditingFicha(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormFicha((prev) => ({
      ...prev,
      [name]: value, // 👈 mantener como string
    }));
  };
  const handleAddFicha = async () => {
    // Validación
    if (
      !formFicha.programa_idprograma ||
      !formFicha.estado_ficha_idestado_ficha
    ) {
      alert("Debes seleccionar un programa y un estado de ficha.");
      return;
    }

    const token = localStorage.getItem("token");

    // Conversión de strings a números
    const fichaData = {
      codigo_ficha: formFicha.codigo_ficha,
      fecha_inicio: formFicha.fecha_inicio,
      programa_idprograma: Number(formFicha.programa_idprograma),
      estado_ficha_idestado_ficha: Number(
        formFicha.estado_ficha_idestado_ficha
      ),
    };

    try {
      await axios.post("http://localhost:8000/fichas", fichaData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenForm(false);
      resetForm();
      fetchFichas();
    } catch (err) {
      console.error("Error al agregar ficha", err);
    }
  };

  const handleUpdateFicha = async () => {
    if (!editingFicha) return;

    // Validación básica
    if (
      !formFicha.programa_idprograma ||
      !formFicha.estado_ficha_idestado_ficha
    ) {
      alert("Debes seleccionar un programa y un estado de ficha.");
      return;
    }

    // Construimos el payload con números, no strings
    const payload = {
      codigo_ficha: formFicha.codigo_ficha,
      fecha_inicio: formFicha.fecha_inicio,
      programa_idprograma: Number(formFicha.programa_idprograma),
      estado_ficha_idestado_ficha: Number(
        formFicha.estado_ficha_idestado_ficha
      ),
    };

    console.log("ID ficha:", editingFicha.idficha);
    console.log("Datos actualizados:", payload);

    try {
      await axios.put(
        `http://localhost:8000/fichas/${editingFicha.idficha}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenEdit(false);
      resetForm();
      fetchFichas();
    } catch (err) {
      console.error("Error al actualizar ficha", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/fichas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFichas();
    } catch (err) {
      console.error("Error al eliminar ficha", err);
    }
  };
  const openEditDialog = (ficha: Ficha) => {
    setEditingFicha(ficha);
    setFormFicha({
      codigo_ficha: ficha.codigo_ficha,
      fecha_inicio: dayjs(ficha.fecha_inicio).format("YYYY-MM-DD"),
      programa_idprograma: ficha.programa_idprograma
        ? String(ficha.programa_idprograma)
        : "",
      estado_ficha_idestado_ficha: ficha.estado_ficha_idestado_ficha
        ? String(ficha.estado_ficha_idestado_ficha)
        : "",
    });
    setOpenEdit(true);
  };

  return (
    <>
      <Box sx={{ backgroundColor: "green", py: 2 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ color: "white", fontWeight: "bold" }}
        >
          Gestión de Fichas - SENA
        </Typography>
      </Box>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Administración - Fichas
        </Typography>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        <Card sx={{ boxShadow: 5, mb: 4, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Fichas
          </Typography>

          <Grid container spacing={2}>
            {fichas.map((ficha) => (
              <Grid item xs={12} sm={6} md={4} key={ficha.idficha}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">
                      Código: {ficha.codigo_ficha}
                    </Typography>
                    <Typography variant="body2">
                      Programa: {ficha.nombre_programa}
                    </Typography>
                    <Typography variant="body2">
                      Estado: {ficha.estado_ficha}
                    </Typography>
                    <Typography variant="body2">
                      Inicio: {dayjs(ficha.fecha_inicio).format("YYYY-MM-DD")}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      color="secondary"
                      onClick={() => handleDelete(ficha.idficha)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        fetchProgramas();
                        fetchEstados();
                        openEditDialog(ficha);
                      }}
                    >
                      Editar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <CardActions>
            <Button
              variant="contained"
              onClick={() => {
                fetchProgramas();
                fetchEstados();
                setOpenForm(true);
              }}
              sx={{ ml: 2, mt: 2 }}
            >
              Agregar Ficha
            </Button>
          </CardActions>
        </Card>

        {/* Crear ficha */}
        <Dialog open={openForm} onClose={() => setOpenForm(false)}>
          <DialogTitle>Agregar Ficha</DialogTitle>
          <DialogContent>
            <TextField
              name="codigo_ficha"
              label="Código de Ficha"
              fullWidth
              margin="dense"
              value={formFicha.codigo_ficha}
              onChange={handleChange}
            />
            <TextField
              name="fecha_inicio"
              label="Fecha de Inicio"
              type="date"
              fullWidth
              margin="dense"
              value={formFicha.fecha_inicio}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* Programa */}
            <TextField
              select
              name="programa_idprograma"
              label="Programa"
              fullWidth
              margin="dense"
              value={formFicha.programa_idprograma}
              onChange={handleChange}
            >
              <MenuItem value="">Selecciona un programa</MenuItem>
              {Array.isArray(programas) &&
                programas.map((p) => (
                  <MenuItem key={p.idprograma} value={String(p.idprograma)}>
                    {p.nombre_programa}
                  </MenuItem>
                ))}
            </TextField>

            {/* Estado de Ficha */}
            <TextField
              select
              name="estado_ficha_idestado_ficha"
              label="Estado de Ficha"
              fullWidth
              margin="dense"
              value={formFicha.estado_ficha_idestado_ficha}
              onChange={handleChange}
              error={!formFicha.estado_ficha_idestado_ficha}
              helperText={
                !formFicha.estado_ficha_idestado_ficha && "Selecciona un estado"
              }
            >
              <MenuItem value="">Selecciona un estado</MenuItem>
              {Array.isArray(estados) &&
                estados.map((e) => (
                  <MenuItem
                    key={e.idestado_ficha}
                    value={String(e.idestado_ficha)}
                  >
                    {e.estado_ficha}
                  </MenuItem>
                ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
            <Button
              onClick={handleAddFicha}
              disabled={
                !formFicha.estado_ficha_idestado_ficha ||
                !formFicha.programa_idprograma
              }
            >
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Editar ficha */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Editar Ficha</DialogTitle>
          <DialogContent>
            <TextField
              name="codigo_ficha"
              label="Código de Ficha"
              fullWidth
              margin="dense"
              value={formFicha.codigo_ficha}
              onChange={handleChange}
            />
            <TextField
              name="fecha_inicio"
              label="Fecha de Inicio"
              type="date"
              fullWidth
              margin="dense"
              value={formFicha.fecha_inicio}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              name="programa_idprograma"
              label="Programa"
              fullWidth
              margin="dense"
              value={formFicha.programa_idprograma}
              onChange={handleChange}
            >
              {programas.map((p) => (
                <MenuItem key={p.idprograma} value={String(p.idprograma)}>
                  {p.nombre_programa}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              name="estado_ficha_idestado_ficha"
              label="Estado de Ficha"
              fullWidth
              margin="dense"
              value={String(formFicha.estado_ficha_idestado_ficha)} // 👈 importante que sea string
              onChange={handleChange}
            >
              <MenuItem value="">Selecciona un estado</MenuItem>
              {estados.map((e) => (
                <MenuItem
                  key={e.idestado_ficha}
                  value={String(e.idestado_ficha)}
                >
                  {e.estado_ficha}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button onClick={handleUpdateFicha}>Actualizar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
