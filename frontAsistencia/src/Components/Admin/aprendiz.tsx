import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import React from "react";

const apiUrl = "http://localhost:8000/aprendiz"; // Endpoint principal para aprendiz

interface Aprendiz {
  idaprendiz?: string;
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
  // Datos del formulario
  const [formData, setFormData] = useState<Aprendiz>({
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
  // Para saber si se está editando y guardar el id a actualizar
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Opciones para los selects
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [estadosAprendiz, setEstadosAprendiz] = useState<EstadoAprendiz[]>([]);
  const [fichas, setFichas] = useState<Ficha[]>([]);

  // 🔃 Cargar la lista de aprendices
  const fetchAprendices = async () => {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setAprendices(data.aprendiz);
  };

  // Cargar datos para los combobox de tipo documento, estado y ficha
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

      setTiposDocumento(tiposData.data);
      setEstadosAprendiz(estadosData.data);
      setFichas(fichasData.data);
      console.log("Tipos:", tiposDocumento);
    } catch (error) {
      console.error("Error al cargar datos para selects:", error);
    }
  };

  useEffect(() => {
    fetchAprendices();
    fetchSelectData();
    console.log("Tipos:", tiposDocumento);
    console.log("Estados:", estadosAprendiz);
    console.log("Fichas:", fichas);
  }, []);

  // Manejo de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Agregar o actualizar aprendiz según el modo
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (isEditing && editingId) {
      // Actualizar aprendiz: se envía el id en el payload como idAprendiz
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, idaprendiz: editingId }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Aprendiz actualizado correctamente");
        setIsEditing(false);
        setEditingId(null);
        resetForm();
        fetchAprendices();
      } else {
        alert("Error al actualizar aprendiz");
      }
    } else {
      // Agregar nuevo aprendiz
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        alert("Aprendiz agregado correctamente");
        resetForm();
        fetchAprendices();
      } else {
        alert("Error al agregar aprendiz");
      }
    }
  };

  // Reinicia el formulario
  const resetForm = () => {
    setFormData({
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

  // Cargar datos del aprendiz en el formulario para editar
  const editAprendiz = (aprendiz: Aprendiz) => {
    setFormData({
      documento_aprendiz: aprendiz.documento_aprendiz,
      nombre_aprendiz: aprendiz.nombre_aprendiz,
      apellido_aprendiz: aprendiz.apellido_aprendiz,
      telefono_aprendiz: aprendiz.telefono_aprendiz,
      email_aprendiz: aprendiz.email_aprendiz,
      password_aprendiz: aprendiz.password_aprendiz,
      ficha_idFicha: aprendiz.ficha_idFicha,
      estado_aprendiz_idEstado_aprendiz:
        aprendiz.estado_aprendiz_idEstado_aprendiz,
      tipo_documento_idTipo_documento: aprendiz.tipo_documento_idTipo_documento,
    });
    setEditingId(aprendiz.idaprendiz || null);
    setIsEditing(true);
  };

  return (
    <Card sx={{ p: 2, maxWidth: 1000, margin: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {isEditing ? "Editar Aprendiz" : "Registro de Aprendices"}
        </Typography>

        {/* Formulario */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Documento Aprendiz"
              name="documento_aprendiz"
              value={formData.documento_aprendiz}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre Aprendiz"
              name="nombre_aprendiz"
              value={formData.nombre_aprendiz}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido Aprendiz"
              name="apellido_aprendiz"
              value={formData.apellido_aprendiz}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono Aprendiz"
              name="telefono_aprendiz"
              value={formData.telefono_aprendiz}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email Aprendiz"
              name="email_aprendiz"
              value={formData.email_aprendiz}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password Aprendiz"
              type="password"
              name="password_aprendiz"
              value={formData.password_aprendiz}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Combobox para Tipo de Documento */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Tipo de Documento"
              name="tipo_documento_idTipo_documento"
              value={formData.tipo_documento_idTipo_documento}
              onChange={handleChange}
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
              value={formData.estado_aprendiz_idEstado_aprendiz}
              onChange={handleChange}
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
              value={formData.ficha_idFicha}
              onChange={handleChange}
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
            <Button variant="contained" onClick={handleSubmit}>
              {isEditing ? "Actualizar Aprendiz" : "Agregar Aprendiz"}
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Lista de Aprendices
        </Typography>
        {aprendices.map((a) => {
          const tipoEncontrado = tiposDocumento.find(
            (tipo) =>
              tipo.idtipo_documento.toString() ===
              a.tipo_documento_idTipo_documento
          );
          const estadoEncontrado = estadosAprendiz.find(
            (estado) =>
              estado.idestado_aprendiz.toString() ===
              a.estado_aprendiz_idEstado_aprendiz
          );
          const fichaEncontrada = fichas.find(
            (ficha) => ficha.idficha.toString() === a.ficha_idFicha
          );
          return (
            <Card
              key={a.idaprendiz}
              sx={{
                mt: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography>
                <strong>Documento:</strong> {a.documento_aprendiz}
              </Typography>
              <Typography>
                <strong>Nombre:</strong> {a.nombres_aprendiz}
              </Typography>
              <Typography>
                <strong>Apellido:</strong> {a.apellidos_aprendiz}
              </Typography>
              <Typography>
                <strong>Teléfono:</strong> {a.telefono_aprendiz}
              </Typography>
              <Typography>
                <strong>Email:</strong> {a.email_aprendiz}
              </Typography>
              <Typography>
                <strong>Password:</strong> {a.password_aprendiz}
              </Typography>
              <Typography>
                <strong>Ficha:</strong>{" "}
                {fichaEncontrada
                  ? fichaEncontrada.codigo_ficha
                  : a.ficha_idFicha}
              </Typography>
              <Typography>
                <strong>Estado:</strong>{" "}
                {estadoEncontrado
                  ? estadoEncontrado.estado_aprendiz
                  : a.estado_aprendiz_idEstado_aprendiz}
              </Typography>
              <Typography>
                <strong>Tipo Documento:</strong>{" "}
                {tipoEncontrado
                  ? tipoEncontrado.tipo_documento
                  : a.tipo_documento_idTipo_documento}
              </Typography>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => editAprendiz(a)}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteAprendiz(a.idaprendiz!)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
