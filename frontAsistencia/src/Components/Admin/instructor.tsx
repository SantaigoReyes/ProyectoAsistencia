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

    // Añadir todos los campos al formData
    Object.entries(formInstructor).forEach(([key, val]) => {
      if (val == null || val === "") return;

      if (key === "url_imgfuncionario" && val instanceof File) {
        formData.append("imagen", val); // ✅ debe llamarse "imagen" para que el backend lo reconozca
      } else {
        formData.append(key, val.toString());
      }
    });

    try {
      await axios.post("http://localhost:8000/crear-instructor", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // ✅ No pongas "Content-Type", Axios lo manejará por ti
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
      {/* Barra verde superior sin margen */}
      <Box
        sx={{
          backgroundColor: "green",
          py: 2,
          width: "100%",
          m: 0,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ color: "white", fontWeight: "bold", m: 0 }}
        >
          Gestión de Instructores - SENA
        </Typography>
      </Box>

      {/* Contenedor sin gutters ni margen */}
      <Container disableGutters sx={{ p: 0, m: 0 }}>
        <Box sx={{ mt: 4, px: 2 }}>
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
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      {inst.url_imgfuncionario ? (
                        <Box
                          component="img"
                          src={encodeURI(
                            `http://localhost:8000${inst.url_imgfuncionario}`
                          )}
                          alt="Instructor"
                          sx={{
                            height: 220,
                            width: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 220,
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#f0f0f0",
                          }}
                        >
                          <Typography color="error" variant="body2">
                            Imagen no disponible
                          </Typography>
                        </Box>
                      )}

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">
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
                          {inst.documento ? (
                            inst.documento
                          ) : (
                            <Typography component="span" color="error">
                              Actualiza
                            </Typography>
                          )}
                        </Typography>

                        <Typography variant="body2">
                          Email:{" "}
                          {inst.email ? (
                            inst.email
                          ) : (
                            <Typography component="span" color="error">
                              Actualiza
                            </Typography>
                          )}
                        </Typography>

                        <Typography variant="body2">
                          Tel:{" "}
                          {inst.telefono ? (
                            inst.telefono
                          ) : (
                            <Typography component="span" color="error">
                              Actualiza
                            </Typography>
                          )}
                        </Typography>
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

          <Dialog open={openForm} onClose={() => setOpenForm(false)}>
            <DialogTitle>Agregar Instructor</DialogTitle>
            <DialogContent>
              {/* Campos comunes */}
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

              {/* Campo corregido: Tipo de Documento */}
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

              {/* Carga de imagen */}
              <input type="file" name="imagen" onChange={handleFileChange} />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
              <Button
                onClick={handleAddInstructor}
                color="primary"
                disabled={!formInstructor.tipo_documento_idtipo_documento}
              >
                Agregar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Diálogo para editar */}
          <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
            <DialogTitle>Editar Instructor</DialogTitle>
            <DialogContent>
              {/* Campos comunes */}
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

              {/* Campo corregido: Tipo de Documento */}
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

              {/* Carga de imagen */}
              <input type="file" name="imagen" onChange={handleFileChange} />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
              <Button onClick={handleUpdateInstructor} color="primary">
                Actualizar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </>
  );
}
