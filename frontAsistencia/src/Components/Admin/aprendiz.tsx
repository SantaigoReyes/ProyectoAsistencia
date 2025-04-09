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

export default function AprendizPanel() {
  const [aprendiz, setAprendiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openAprendices, setOpenAprendices] = useState(false);
  const [openEditAprendiz, setOpenEditAprendiz] = useState(false);
  const [editingAprendiz, setEditingAprendiz] = useState<any>(null);

  const [formAprendices, setFormAprendices] = useState({
    documento_aprendiz: "",
    nombre_aprendiz: "",
    apellido_aprendiz: "",
    telefono_aprendiz: "",
    email_aprendiz: "",
    password_aprendiz: "",
    ficha_idFicha: "",
    estado_aprendiz_idEstado_aprendiz: "",
    tipo_documento_idTipo_documento: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/aprendiz", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📌 Respuesta de programas:", response.data);

      setAprendiz(response.data.aprendiz || response.data || []);
    } catch (error) {
      setError("Error al cargar aprendices.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/aprendiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  const handleAddAprendiz = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/aprendiz", formAprendices, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setOpenAprendices(false);
      setFormAprendices({
        documento_aprendiz: "",
        nombre_aprendiz: "",
        apellido_aprendiz: "",
        telefono_aprendiz: "",
        email_aprendiz: "",
        password_aprendiz: "",
        ficha_idFicha: "",
        estado_aprendiz_idEstado_aprendiz: "",
        tipo_documento_idTipo_documento: "",
      });

      fetchData();
    } catch (error) {
      console.error("Error al agregar aprendiz", error);
    }
  };

  const handleOpenEditAprendiz = (aprendiz: any) => {
    setEditingAprendiz(aprendiz);
    setOpenEditAprendiz(true);
  };

  const handleUpdateAprendiz = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/aprendiz/${editingAprendiz.idAprendiz}`,
        editingAprendiz,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpenEditAprendiz(false);
      setEditingAprendiz(null);
      fetchData();
    } catch (error) {
      console.error("Error al actualizar aprendiz", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "green",
          py: 2,
          position: "relative", // podés cambiarlo a fixed si querés que se mantenga al hacer scroll
          top: 0,
          left: 0,
          width: "100%",
          m: 0, // elimina márgenes
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ color: "white", fontWeight: "bold", m: 0 }}
        >
          Gestión de Aprendices - SENA
        </Typography>
      </Box>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Panel de administrador para Aprendiz
        </Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="red">{error}</Typography>}
        <Card sx={{ boxShadow: 5, mb: 4, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Aprendiz
          </Typography>
          <Grid container spacing={2}>
            {aprendiz.length > 0 ? (
              aprendiz.map((apr) => (
                <Grid item xs={12} sm={6} md={4} key={apr.idaprendiz}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">
                        Nombre: {apr.nombres_aprendiz} {apr.apellidos_aprendiz}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Email: {apr.email_aprendiz}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Teléfono: {apr.telefono_aprendiz}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Documento: {apr.documento_aprendiz}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Tipo Documento: {apr.tipo_documento_idTipo_documento}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        password: {apr.password_aprendiz}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        color="secondary"
                        onClick={() => handleDelete(apr.idaprendiz)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => handleOpenEditAprendiz(apr)}
                      >
                        Editar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary" sx={{ ml: 2 }}>
                No hay Aprendices disponibles.
              </Typography>
            )}
          </Grid>

          <CardActions>
            <Button
              variant="contained"
              onClick={() => setOpenAprendices(true)}
              sx={{ ml: 2, mb: 2 }}
            >
              Agregar Aprendiz
            </Button>
          </CardActions>
        </Card>

        {/* Diálogo para agregar aprendiz */}
        <Dialog open={openAprendices} onClose={() => setOpenAprendices(false)}>
          <DialogTitle>Agregar Aprendiz</DialogTitle>
          <DialogContent>
            {Object.keys(formAprendices).map((key) => (
              <TextField
                key={key}
                label={key.replace(/_/g, " ")}
                fullWidth
                margin="dense"
                value={formAprendices[key as keyof typeof formAprendices]}
                onChange={(e) =>
                  setFormAprendices({
                    ...formAprendices,
                    [key]: e.target.value,
                  })
                }
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAprendices(false)}>Cancelar</Button>
            <Button onClick={handleAddAprendiz} color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo para editar aprendiz */}
        <Dialog
          open={openEditAprendiz}
          onClose={() => setOpenEditAprendiz(false)}
        >
          <DialogTitle>Editar Aprendiz</DialogTitle>
          <DialogContent>
            {editingAprendiz &&
              Object.keys(formAprendices).map((key) => (
                <TextField
                  key={key}
                  label={key.replace(/_/g, " ")}
                  fullWidth
                  margin="dense"
                  value={editingAprendiz[key] || ""}
                  onChange={(e) =>
                    setEditingAprendiz({
                      ...editingAprendiz,
                      [key]: e.target.value,
                    })
                  }
                />
              ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditAprendiz(false)}>Cancelar</Button>
            <Button onClick={handleUpdateAprendiz} color="primary">
              Actualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
