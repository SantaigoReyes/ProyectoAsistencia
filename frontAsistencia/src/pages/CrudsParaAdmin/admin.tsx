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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración - Programas
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {/* Sección de Programas en Card */}
      <Card sx={{ boxShadow: 5, mb: 4, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Programas
        </Typography>
        <Grid container spacing={2}>
          {programas.length > 0 ? (
            programas.map((programa) => (
              <Grid item xs={12} sm={6} md={4} key={programa.idprograma}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">
                      {programa.nombre_programa || programa.nombrePrograma}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Código:{" "}
                      {programa.codigo_programa || programa.codigoPrograma}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      color="secondary"
                      onClick={() => handleDelete(programa.idprograma)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      color="primary"
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
        <CardActions>
          <Button
            variant="contained"
            onClick={() => setOpenPrograma(true)}
            sx={{ ml: 2, mb: 2 }}
          >
            Agregar Programa
          </Button>
        </CardActions>
      </Card>

      {/* Diálogo para agregar Programa */}
      <Dialog open={openPrograma} onClose={() => setOpenPrograma(false)}>
        <DialogTitle>Agregar Programa</DialogTitle>
        <DialogContent>
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
        <DialogActions>
          <Button onClick={() => setOpenPrograma(false)}>Cancelar</Button>
          <Button onClick={handleAddPrograma} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar Programa */}
      <Dialog
        open={openEditPrograma}
        onClose={() => setOpenEditPrograma(false)}
      >
        <DialogTitle>Editar Programa</DialogTitle>
        <DialogContent>
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
        <DialogActions>
          <Button onClick={() => setOpenEditPrograma(false)}>Cancelar</Button>
          <Button onClick={handleUpdatePrograma} color="primary">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
