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

export default function AdminInstructorPanel() {
  const [instructores, setInstructores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [formInstructor, setFormInstructor] = useState<any>({
    documento: "",
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    password: "",
    tipo_documento_idtipo_documento: "",
    url_imgfuncionario: null,
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<any>(null);

  const fetchInstructores = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/listar-instructor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstructores(res.data.data);
    } catch (err) {
      setError("No se pudo cargar la lista de instructores.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructores();
  }, []);

  const handleFileChange = (e: any) => {
    setFormInstructor({
      ...formInstructor,
      url_imgfuncionario: e.target.files[0],
    });
  };

  const handleChange = (e: any) => {
    setFormInstructor({ ...formInstructor, [e.target.name]: e.target.value });
  };

  const handleAddInstructor = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(formInstructor).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

    try {
      await axios.post("http://localhost:8000/crear-instructor", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenForm(false);
      resetForm();
      fetchInstructores();
    } catch (err) {
      console.error("Error al crear instructor", err);
    }
  };

  const handleUpdateInstructor = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(formInstructor).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

    try {
      await axios.put(
        `http://localhost:8000/editar-instructor/${editingInstructor.idfuncionario}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenEdit(false);
      resetForm();
      fetchInstructores();
    } catch (err) {
      console.error("Error al actualizar instructor", err);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/eliminar-instructor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInstructores();
    } catch (err) {
      console.error("Error al eliminar instructor", err);
    }
  };

  const resetForm = () => {
    setFormInstructor({
      documento: "",
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
      password: "",
      tipo_documento_idtipo_documento: "",
      url_imgfuncionario: null,
    });
    setEditingInstructor(null);
  };

  const openEditDialog = (inst: any) => {
    setEditingInstructor(inst);
    setFormInstructor({
      documento: inst.documento,
      nombres: inst.nombres,
      apellidos: inst.apellidos,
      email: inst.email,
      telefono: inst.telefono,
      password: inst.password,
      tipo_documento_idtipo_documento: inst.tipo_documento_idtipo_documento,
      url_imgfuncionario: null,
    });
    setOpenEdit(true);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración - Instructores
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Card sx={{ boxShadow: 5, mb: 4, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Instructores
        </Typography>
        <Grid container spacing={2}>
          {instructores.length > 0 ? (
            instructores.map((inst) => (
              <Grid item xs={12} sm={6} md={4} key={inst.idfuncionario}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">
                      {inst.nombres} {inst.apellidos}
                    </Typography>
                    <Typography variant="body2">Email: {inst.email}</Typography>
                    <Typography variant="body2">
                      Tel: {inst.telefono}
                    </Typography>
                    {inst.url_imgfuncionario && (
                      <img
                        src={`http://localhost:8000/${inst.url_imgfuncionario}`}
                        alt="img"
                        width="100"
                      />
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      color="secondary"
                      onClick={() => handleDelete(inst.idfuncionario)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => openEditDialog(inst)}
                    >
                      Editar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography color="textSecondary" sx={{ ml: 2 }}>
              No hay instructores disponibles.
            </Typography>
          )}
        </Grid>
        <CardActions>
          <Button
            variant="contained"
            onClick={() => setOpenForm(true)}
            sx={{ ml: 2, mb: 2 }}
          >
            Agregar Instructor
          </Button>
        </CardActions>
      </Card>

      {/* Crear */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Agregar Instructor</DialogTitle>
        <DialogContent>
          {[
            "documento",
            "nombres",
            "apellidos",
            "email",
            "telefono",
            "password",
          ].map((field) => (
            <TextField
              key={field}
              label={field}
              name={field}
              fullWidth
              margin="dense"
              value={formInstructor[field]}
              onChange={handleChange}
            />
          ))}
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button onClick={handleAddInstructor} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Editar */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Instructor</DialogTitle>
        <DialogContent>
          {[
            "documento",
            "nombres",
            "apellidos",
            "email",
            "telefono",
            "password",
          ].map((field) => (
            <TextField
              key={field}
              label={field}
              name={field}
              fullWidth
              margin="dense"
              value={formInstructor[field]}
              onChange={handleChange}
            />
          ))}
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={handleUpdateInstructor} color="primary">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
