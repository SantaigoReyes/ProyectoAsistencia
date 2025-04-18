import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Fade from "@mui/material/Fade";

const apiUrl = "http://localhost:8000/aprendiz"; // Endpoint principal para aprendiz

interface Aprendiz {
  idAprendiz?: string;
  documento_aprendiz: string;
  nombre_aprendiz: string;
  apellido_aprendiz: string;
  telefono_aprendiz: string;
  email_aprendiz: string;
  password_aprendiz: string;
  ficha_idFicha: string;
  estado_aprendiz_idEstado_aprendiz: string;
  tipo_documento_idTipo_documento: string;
}

interface TipoDocumento {
  idtipo_documento: number;
  tipo_documento: string;
  abreviatura_tipo_documento?: string;
}

interface EstadoAprendiz {
  idestado_aprendiz: number;
  estado_aprendiz: string;
}

interface Ficha {
  idficha: number;
  codigo_ficha: string;
}

export default function Aprendices() {
  // Lista de aprendices
  const [aprendices, setAprendices] = useState<Aprendiz[]>([]);
  // Formulario para agregar (siempre visible)
  const [formAdd, setFormAdd] = useState<Aprendiz>({
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
  // Formulario para actualizar (en modal)
  const [formEdit, setFormEdit] = useState<Aprendiz>({
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
  // Id del aprendiz a actualizar
  const [editingId, setEditingId] = useState<string | null>(null);
  // Control del modal de edición
  const [openEditModal, setOpenEditModal] = useState(false);

  // Opciones para los selects
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [estadosAprendiz, setEstadosAprendiz] = useState<EstadoAprendiz[]>([]);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  // Cargar la lista de aprendices
  const fetchAprendices = async () => {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setAprendices(data.aprendiz);
  };

  // Cargar datos para los selects
  const fetchSelectData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [tiposRes, estadosRes, fichasRes] = await Promise.all([
        fetch("http://localhost:8000/tipodocumento", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/estadoaprendiz", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/fichas", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const tiposData = await tiposRes.json();
      const estadosData = await estadosRes.json();
      const fichasData = await fichasRes.json();

      setTiposDocumento(tiposData.data || tiposData);
      setEstadosAprendiz(estadosData.data || estadosData);
      setFichas(fichasData.data || fichasData);
    } catch (error) {
      console.error("Error al cargar datos para selects:", error);
    }
  };

  useEffect(() => {
    fetchAprendices();
    fetchSelectData();
  }, []);

  // Manejo de cambios en el formulario de agregar
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormAdd({ ...formAdd, [e.target.name]: e.target.value });
  };

  // Manejo de cambios en el formulario de editar
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };
  const handleAdd = async () => {
    // Verificar si algún campo está vacío
    const values = Object.values(formAdd);
    const isEmptyField = values.some((value) => value === "");

    if (isEmptyField) {
      alert("Por favor completa todos los campos antes de agregar");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formAdd),
    });

    const result = await res.json();
    if (result.success) {
      alert("Aprendiz agregado correctamente");
      resetAddForm();
      fetchAprendices();
    } else {
      alert("Error al agregar aprendiz");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) {
      alert("No se encontró el id del aprendiz a actualizar.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No se encontró el token de autenticación.");
        return;
      }
      console.log("Enviando actualización con payload:", {
        ...formEdit,
        idAprendiz: editingId,
      });

      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Aseguramos enviar "idAprendiz" con A mayúscula, tal como espera el backend
        body: JSON.stringify({ ...formEdit, idAprendiz: String(editingId) }),
      });

      if (!res.ok) {
        const errorText = await res.text(); // intentamos leer la respuesta como texto
        console.error(
          "Error en la respuesta del servidor:",
          res.status,
          res.statusText,
          errorText
        );
        alert(`Error ${res.status} - ${res.statusText}\n${errorText}`);
        return;
      }

      const result = await res.json();
      console.log("Respuesta de actualización:", result);

      if (result.success) {
        alert("Aprendiz actualizado correctamente");
        setOpenEditModal(false);
        resetEditForm();
        fetchAprendices();
      } else {
        alert("Error al actualizar aprendiz: " + (result.msg || ""));
      }
    } catch (error) {
      console.error("Error en handleUpdate:", error);
      alert("Error al actualizar aprendiz");
    }
  };

  // Reiniciar formulario de agregar
  const resetAddForm = () => {
    setFormAdd({
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
  };

  // Reiniciar formulario de editar
  const resetEditForm = () => {
    setFormEdit({
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
    setEditingId(null);
  };

  // Eliminar aprendiz
  const deleteAprendiz = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este aprendiz?")) return;
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    fetchAprendices();
  };

  const editAprendiz = (aprendiz: Aprendiz) => {
    console.log("Aprendiz seleccionado para edición:", aprendiz);
    // Verifica si el objeto tiene el id con "idAprendiz" (con A mayúscula) o "idaprendiz" (minúscula)
    const id = aprendiz.idAprendiz || (aprendiz as any).idaprendiz || null;

    if (!id) {
      alert("No se encontró el id del aprendiz");
      return;
    } // 3) Log de cada campo select para verificar
    // 🔍 Buscar IDs a partir de los nombres (por si los necesitas en otro formato)
    const tipoDoc = tiposDocumento.find(
      (t) => t.tipo_documento === aprendiz.tipo_documento
    );
    const estado = estadosAprendiz.find(
      (e) => e.estado_aprendiz === aprendiz.estado
    );
    const ficha = fichas.find((f) => f.idficha === aprendiz.ficha_idficha);

    console.log("·· tipo_documento encontrado:", tipoDoc);
    console.log("·· estado_aprendiz encontrado:", estado);
    console.log("·· ficha encontrada:", ficha);
    setFormEdit({
      documento_aprendiz: aprendiz.documento_aprendiz || "",
      nombre_aprendiz: aprendiz.nombre_aprendiz || aprendiz.nombres_aprendiz,
      apellido_aprendiz:
        aprendiz.apellido_aprendiz || aprendiz.apellidos_aprendiz,
      telefono_aprendiz: aprendiz.telefono_aprendiz || "",
      email_aprendiz: aprendiz.email_aprendiz || "",
      password_aprendiz: aprendiz.password_aprendiz || "",
      // 🧠 Asigna el ID como string al form, que es lo que necesita el select
      ficha_idFicha: ficha ? String(ficha.idficha) : "",
      estado_aprendiz_idEstado_aprendiz: estado
        ? String(estado.idestado_aprendiz)
        : "",
      tipo_documento_idTipo_documento: tipoDoc
        ? String(tipoDoc.idtipo_documento)
        : "",
    });
    setEditingId(id);
    setOpenEditModal(true);
  };
  if (
    !tiposDocumento.length ||
    !estadosAprendiz.length ||
    !fichas.length ||
    !aprendices.length
  ) {
    return <div>Cargando aprendices...</div>;
  }

  return (
    <>
      {/* Formulario para agregar aprendiz */}
      <Card sx={{ p: 2, maxWidth: 1000, margin: "auto", mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Registro de Aprendices
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Documento Aprendiz"
                name="documento_aprendiz"
                value={formAdd.documento_aprendiz}
                onChange={handleAddChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre Aprendiz"
                name="nombre_aprendiz"
                value={formAdd.nombre_aprendiz}
                onChange={handleAddChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido Aprendiz"
                name="apellido_aprendiz"
                value={formAdd.apellido_aprendiz}
                onChange={handleAddChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono Aprendiz"
                name="telefono_aprendiz"
                value={formAdd.telefono_aprendiz}
                onChange={handleAddChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Aprendiz"
                name="email_aprendiz"
                value={formAdd.email_aprendiz}
                onChange={handleAddChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password Aprendiz"
                type="password"
                name="password_aprendiz"
                value={formAdd.password_aprendiz}
                onChange={handleAddChange}
                fullWidth
              />
            </Grid>

            {/* Combobox para Tipo de Documento */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Tipo de Documento"
                name="tipo_documento_idTipo_documento"
                value={formAdd.tipo_documento_idTipo_documento}
                onChange={handleAddChange}
                fullWidth
                sx={{ minWidth: 250 }}
                InputLabelProps={{ sx: { fontSize: "1.2rem" } }}
                SelectProps={{ sx: { fontSize: "1.2rem", minHeight: "56px" } }}
              >
                {tiposDocumento.length > 0 ? (
                  tiposDocumento.map((tipo) => (
                    <MenuItem
                      key={tipo.idtipo_documento}
                      value={tipo.idtipo_documento.toString()}
                      sx={{ fontSize: "1.2rem" }}
                    >
                      {tipo.tipo_documento}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>Cargando...</em>
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            {/* Combobox para Estado del Aprendiz */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Estado del Aprendiz"
                name="estado_aprendiz_idEstado_aprendiz"
                value={formAdd.estado_aprendiz_idEstado_aprendiz}
                onChange={handleAddChange}
                fullWidth
                sx={{ minWidth: 250 }}
                InputLabelProps={{ sx: { fontSize: "1.2rem" } }}
                SelectProps={{ sx: { fontSize: "1.2rem", minHeight: "56px" } }}
              >
                {estadosAprendiz.length > 0 ? (
                  estadosAprendiz.map((estado) => (
                    <MenuItem
                      key={estado.idestado_aprendiz}
                      value={estado.idestado_aprendiz.toString()}
                      sx={{ fontSize: "1.2rem" }}
                    >
                      {estado.estado_aprendiz}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>Cargando...</em>
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            {/* Combobox para Ficha */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Ficha"
                name="ficha_idFicha"
                value={formAdd.ficha_idFicha}
                onChange={handleAddChange}
                fullWidth
                sx={{ minWidth: 250 }}
                InputLabelProps={{ sx: { fontSize: "1.2rem" } }}
                SelectProps={{ sx: { fontSize: "1.2rem", minHeight: "56px" } }}
              >
                {fichas.length > 0 ? (
                  fichas.map((ficha) => (
                    <MenuItem
                      key={ficha.idficha}
                      value={ficha.idficha.toString()}
                      sx={{ fontSize: "1.2rem" }}
                    >
                      {ficha.codigo_ficha}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>Cargando...</em>
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={handleAdd}>
                Agregar Aprendiz
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de aprendices */}

      <Card sx={{ p: 2, maxWidth: 1700, margin: "auto", mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Aprendices
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small" aria-label="tabla de aprendices">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Documento
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Nombre
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Apellido
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Teléfono
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Ficha
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Programa
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Código Programa
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Tipo Doc.
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {aprendices.map((a) => {
                  const id = a.idAprendiz || a.idaprendiz;

                  return (
                    <Fade in={true} timeout={700}>
                      <TableRow
                        key={id}
                        sx={{
                          backgroundColor:
                            highlightedId === id ? "#bbdefb" : "inherit",
                          transition: "background-color 0.5s ease",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <TableCell>{a.documento_aprendiz}</TableCell>
                        <TableCell>
                          {a.nombres_aprendiz || a.nombre_aprendiz}
                        </TableCell>
                        <TableCell>
                          {a.apellidos_aprendiz || a.apellido_aprendiz}
                        </TableCell>
                        <TableCell>{a.telefono_aprendiz}</TableCell>
                        <TableCell>{a.email_aprendiz}</TableCell>
                        <TableCell>{a.codigo_ficha}</TableCell>
                        <TableCell>{a.nombre_programa}</TableCell>
                        <TableCell>{a.codigo_programa}</TableCell>
                        <TableCell>{a.estado}</TableCell>
                        <TableCell>{a.tipo_documento}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => editAprendiz(a)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => deleteAprendiz(id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modal de edición */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Actualizar Aprendiz</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Documento Aprendiz"
                name="documento_aprendiz"
                value={formEdit.documento_aprendiz}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre Aprendiz"
                name="nombre_aprendiz"
                value={formEdit.nombre_aprendiz}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido Aprendiz"
                name="apellido_aprendiz"
                value={formEdit.apellido_aprendiz}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono Aprendiz"
                name="telefono_aprendiz"
                value={formEdit.telefono_aprendiz}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Aprendiz"
                name="email_aprendiz"
                value={formEdit.email_aprendiz}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password Aprendiz"
                type="password"
                name="password_aprendiz"
                value={formEdit.password_aprendiz}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            {/* Combobox para Tipo de Documento */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Tipo de Documento"
                name="tipo_documento_idTipo_documento"
                value={formEdit.tipo_documento_idTipo_documento}
                onChange={handleEditChange}
                fullWidth
                sx={{ minWidth: 250 }}
                InputLabelProps={{ sx: { fontSize: "1.2rem" } }}
                SelectProps={{ sx: { fontSize: "1.2rem", minHeight: "56px" } }}
              >
                {tiposDocumento.length > 0 ? (
                  tiposDocumento.map((tipo) => (
                    <MenuItem
                      key={tipo.idtipo_documento}
                      value={tipo.idtipo_documento.toString()}
                      sx={{ fontSize: "1.2rem" }}
                    >
                      {tipo.tipo_documento}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>Cargando...</em>
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            {/* Combobox para Estado del Aprendiz */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Estado del Aprendiz"
                name="estado_aprendiz_idEstado_aprendiz"
                value={formEdit.estado_aprendiz_idEstado_aprendiz}
                onChange={handleEditChange}
                fullWidth
                sx={{ minWidth: 250 }}
                InputLabelProps={{ sx: { fontSize: "1.2rem" } }}
                SelectProps={{ sx: { fontSize: "1.2rem", minHeight: "56px" } }}
              >
                {estadosAprendiz.length > 0 ? (
                  estadosAprendiz.map((estado) => (
                    <MenuItem
                      key={estado.idestado_aprendiz}
                      value={estado.idestado_aprendiz.toString()}
                      sx={{ fontSize: "1.2rem" }}
                    >
                      {estado.estado_aprendiz}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>Cargando...</em>
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            {/* Combobox para Ficha */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Ficha"
                name="ficha_idFicha"
                value={formEdit.ficha_idFicha}
                onChange={handleEditChange}
                fullWidth
                sx={{ minWidth: 250 }}
                InputLabelProps={{ sx: { fontSize: "1.2rem" } }}
                SelectProps={{ sx: { fontSize: "1.2rem", minHeight: "56px" } }}
              >
                {fichas.length > 0 ? (
                  fichas.map((ficha) => (
                    <MenuItem
                      key={ficha.idficha}
                      value={ficha.idficha.toString()}
                      sx={{ fontSize: "1.2rem" }}
                    >
                      {ficha.codigo_ficha}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>Cargando...</em>
                  </MenuItem>
                )}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Actualizar Aprendiz
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
