import { useEffect, useState } from "react";
import {
  Box,
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
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import React from "react";
export default function AdminInstructorPanel() {
  const [instructores, setInstructores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoTouched, setTipoTouched] = useState(false);

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
      console.log("Instructores:", res.data.data);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormInstructor({ ...formInstructor, url_imgfuncionario: file });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInstructor({ ...formInstructor, [e.target.name]: e.target.value });
  };
  const handleAddInstructor = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // ✅ Añadir todos los campos al formData
    Object.entries(formInstructor).forEach(([key, val]) => {
      if (val == null || val === "") return;

      if (key === "url_imgfuncionario" && val instanceof File) {
        formData.append("imagen", val); // 👈 nombre correcto para el backend
      } else {
        formData.append(key, val.toString());
      }
    });

    try {
      await axios.post("http://localhost:8000/crear-instructor", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOpenForm(false);
      resetForm();
      fetchInstructores();
    } catch (err) {
      console.error("❌ Error al crear instructor:", err);
    }
  };

  const handleUpdateInstructor = async () => {
    if (!editingInstructor) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(formInstructor).forEach(([key, val]) => {
      if (val == null) return;

      if (key === "url_imgfuncionario" && val instanceof File) {
        formData.append("imagen", val); // 👈 este es el campo que el middleware espera
      } else {
        formData.append(key, String(val));
      }
    });

    try {
      await axios.put(
        `http://localhost:8000/editar-instructor/${editingInstructor.idfuncionario}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenEdit(false);
      resetForm();
      fetchInstructores();
    } catch (err) {
      console.error("Error al actualizar instructor", err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas eliminar este instructor?"
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/eliminar-instructor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Instructor eliminado");
      fetchInstructores();
    } catch (err) {
      console.error("❌ Error al eliminar instructor", err);
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
    <>
      {/* Barra verde superior */}
      <Box
        sx={{
          backgroundColor: "#007A33", // Verde SENA
          py: 2,
          width: "100%",
          m: 0,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "white", fontWeight: "bold", letterSpacing: 1 }}
        >
          Gestión de Instructores - SENA
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Panel de Administración - Instructores
        </Typography>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        <Card sx={{ boxShadow: 4, borderRadius: 3, p: 3, mb: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="bold">
              Instructores
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenForm(true)}
              sx={{ borderRadius: 2 }}
            >
              Agregar Instructor
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {instructores.length > 0 ? (
              instructores.map((inst) => (
                <Grid item xs={12} sm={6} md={4} key={inst.idfuncionario}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {inst.url_imgfuncionario ? (
                      <Box
                        component="img"
                        src={`http://localhost:8000${inst.url_imgfuncionario}`}
                        alt="Instructor"
                        sx={{
                          height: 200,
                          width: "100%",
                          objectFit: "cover",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#f0f0f0",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      >
                        <Typography color="error" variant="body2">
                          Imagen no disponible
                        </Typography>
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography fontWeight="bold">
                        {inst.nombres && inst.apellidos ? (
                          `${inst.nombres} ${inst.apellidos}`
                        ) : (
                          <Typography component="span" color="error">
                            Actualiza
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="body2">
                        Documento:{" "}
                        {inst.documento || (
                          <Typography component="span" color="error">
                            Actualiza
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="body2">
                        Email:{" "}
                        {inst.email || (
                          <Typography component="span" color="error">
                            Actualiza
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="body2">
                        Tel:{" "}
                        {inst.telefono || (
                          <Typography component="span" color="error">
                            Actualiza
                          </Typography>
                        )}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(inst.idfuncionario)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        size="small"
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
        </Card>

        {/* Diálogo Agregar */}
        <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
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

            <TextField
              select
              label="Tipo de Documento"
              name="tipo_documento_idtipo_documento"
              fullWidth
              margin="dense"
              value={formInstructor.tipo_documento_idtipo_documento}
              onChange={handleChange}
              required
              error={!formInstructor.tipo_documento_idtipo_documento}
              helperText={
                !formInstructor.tipo_documento_idtipo_documento
                  ? "Selecciona un tipo de documento"
                  : ""
              }
            >
              <MenuItem value="">Selecciona una opción</MenuItem>
              <MenuItem value="1">Cédula</MenuItem>
              <MenuItem value="2">Tarjeta de Identidad</MenuItem>
              <MenuItem value="3">Pasaporte</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Subir imagen
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
            <Button
              onClick={handleAddInstructor}
              color="primary"
              variant="contained"
              disabled={!formInstructor.tipo_documento_idtipo_documento}
            >
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo Editar */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
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

            <TextField
              select
              label="Tipo de Documento"
              name="tipo_documento_idtipo_documento"
              fullWidth
              margin="dense"
              value={formInstructor.tipo_documento_idtipo_documento}
              onChange={handleChange}
              required
              error={!formInstructor.tipo_documento_idtipo_documento}
              helperText={
                !formInstructor.tipo_documento_idtipo_documento
                  ? "Selecciona un tipo de documento"
                  : ""
              }
            >
              <MenuItem value="">Selecciona una opción</MenuItem>
              <MenuItem value="1">Cédula</MenuItem>
              <MenuItem value="2">Tarjeta de Identidad</MenuItem>
              <MenuItem value="3">Pasaporte</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Cambiar imagen
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button
              onClick={handleUpdateInstructor}
              variant="contained"
              color="primary"
            >
              Actualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
