import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import React from "react";

export default function AdminPanel() {
  // Estado para programas
  const [programas, setProgramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para diálogo y formulario de agregar Programa
  const [openPrograma, setOpenPrograma] = useState(false);
  const [formPrograma, setFormPrograma] = useState({
    codigoPrograma: "",
    nombrePrograma: "",
  });

  // Estados para editar (update) un programa
  const [openEditPrograma, setOpenEditPrograma] = useState(false);
  const [editingPrograma, setEditingPrograma] = useState<any>(null);

  // Función para cargar los programas
  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  // Función para eliminar un programa
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/programa/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  // Función para agregar un Programa
  const handleAddPrograma = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/programa",
        {
          codigoPrograma: formPrograma.codigoPrograma,
          nombrePrograma: formPrograma.nombrePrograma,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpenPrograma(false);
      setFormPrograma({ codigoPrograma: "", nombrePrograma: "" });
      fetchData();
    } catch (error) {
      console.error("Error al agregar programa", error);
    }
  };

  // Función para abrir el diálogo de edición, llenando el formulario con los datos actuales
  const handleOpenEditPrograma = (programa: any) => {
    setEditingPrograma(programa);
    setOpenEditPrograma(true);
  };

  // Función para actualizar un Programa
  const handleUpdatePrograma = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        idPrograma: editingPrograma.idprograma || editingPrograma.idPrograma, // usar "idPrograma"
        codigoPrograma:
          editingPrograma.codigo_programa || editingPrograma.codigoPrograma,
        nombrePrograma:
          editingPrograma.nombre_programa || editingPrograma.nombrePrograma,
      };
      console.log("Actualizando con payload:", payload);
      const response = await axios.put(
        "http://localhost:8000/programa",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Respuesta de actualización:", response.data);
      setOpenEditPrograma(false);
      setEditingPrograma(null);
      fetchData();
    } catch (error: any) {
      console.error(
        "Error al actualizar programa:",
        error.response?.data || error
      );
    }
  };
  return (
    <>
      {/* Encabezado principal */}
      <Box
        sx={{
          background: "linear-gradient(to right, #0b6623, #1e9b44)", // verde institucional con degradado
          py: 3,
          position: "relative",
          top: 0,
          left: 0,
          width: "100%",
          m: 0,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "white", fontWeight: "bold", letterSpacing: 1 }}
        >
          Gestión de Programas - SENA
        </Typography>
      </Box>

      {/* Contenedor principal */}
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#0b6623" }}>
          Panel de Administración de Programas
        </Typography>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {/* Sección de programas */}
        <Card sx={{ boxShadow: 6, mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: "#1e9b44" }}>
              Lista de Programas
            </Typography>
            <Grid container spacing={2}>
              {programas.length > 0 ? (
                programas.map((programa) => (
                  <Grid item xs={12} sm={6} md={4} key={programa.idprograma}>
                    <Card
                      sx={{
                        border: "1px solid #c8e6c9",
                        borderRadius: 2,
                        backgroundColor: "#f1f8e9",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {programa.nombre_programa || programa.nombrePrograma}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Código:{" "}
                          {programa.codigo_programa || programa.codigoPrograma}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          color="error"
                          onClick={() => handleDelete(programa.idprograma)}
                        >
                          Eliminar
                        </Button>
                        <Button
                          color="success"
                          onClick={() => handleOpenEditPrograma(programa)}
                        >
                          Editar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography color="textSecondary" sx={{ ml: 2 }}>
                  No hay programas disponibles.
                </Typography>
              )}
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
            <Button
              variant="contained"
              onClick={() => setOpenPrograma(true)}
              sx={{
                backgroundColor: "#1e9b44",
                "&:hover": { backgroundColor: "#158a39" },
              }}
            >
              Agregar Programa
            </Button>
          </CardActions>
        </Card>

        {/* Diálogo para agregar Programa */}
        <Dialog open={openPrograma} onClose={() => setOpenPrograma(false)}>
          <DialogTitle sx={{ backgroundColor: "#e8f5e9", color: "#0b6623" }}>
            Agregar Programa
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#f9fbe7" }}>
            <TextField
              label="Código del Programa"
              fullWidth
              margin="dense"
              value={formPrograma.codigoPrograma}
              onChange={(e) =>
                setFormPrograma({
                  ...formPrograma,
                  codigoPrograma: e.target.value,
                })
              }
            />
            <TextField
              label="Nombre del Programa"
              fullWidth
              margin="dense"
              value={formPrograma.nombrePrograma}
              onChange={(e) =>
                setFormPrograma({
                  ...formPrograma,
                  nombrePrograma: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#f1f8e9" }}>
            <Button onClick={() => setOpenPrograma(false)}>Cancelar</Button>
            <Button onClick={handleAddPrograma} color="success">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo para editar Programa */}
        <Dialog
          open={openEditPrograma}
          onClose={() => setOpenEditPrograma(false)}
        >
          <DialogTitle sx={{ backgroundColor: "#e8f5e9", color: "#0b6623" }}>
            Editar Programa
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#f9fbe7" }}>
            <TextField
              label="Código del Programa"
              fullWidth
              margin="dense"
              value={
                editingPrograma?.codigo_programa ||
                editingPrograma?.codigoPrograma ||
                ""
              }
              onChange={(e) =>
                setEditingPrograma({
                  ...editingPrograma,
                  codigo_programa: e.target.value,
                })
              }
            />
            <TextField
              label="Nombre del Programa"
              fullWidth
              margin="dense"
              value={
                editingPrograma?.nombre_programa ||
                editingPrograma?.nombrePrograma ||
                ""
              }
              onChange={(e) =>
                setEditingPrograma({
                  ...editingPrograma,
                  nombre_programa: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#f1f8e9" }}>
            <Button onClick={() => setOpenEditPrograma(false)}>Cancelar</Button>
            <Button onClick={handleUpdatePrograma} color="success">
              Actualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
