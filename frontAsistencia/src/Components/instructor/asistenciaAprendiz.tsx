import React, { useEffect, useState } from "react";

const AsistenciaForm = () => {
  const [fichas, setFichas] = useState([]);
  const [fichaSeleccionada, setFichaSeleccionada] = useState("");
  const [aprendices, setAprendices] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [fechaAsistencia, setFechaAsistencia] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const res = await fetch("http://localhost:8000/fichas-instructor", {
          headers: { Authorization: `Bearer ${token} ` },
        });
        const data = await res.json();
        setFichas(data.fichas || []);
      } catch (error) {
        console.error("Error al obtener fichas:", error);
      }
    };
    fetchFichas();
  }, [token]);

  useEffect(() => {
    if (!fichaSeleccionada) return;

    const fetchAprendices = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/aprendices-por-ficha?idFicha=${fichaSeleccionada}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setAprendices(data.aprendices || []);
      } catch (error) {
        console.error("Error al obtener aprendices:", error);
      }
    };
    fetchAprendices();
  }, [fichaSeleccionada, token]);

  const handleAsistenciaChange = (idAprendiz, tipoAsistencia) => {
    setAsistencias((prev) => ({
      ...prev,
      [idAprendiz]: tipoAsistencia,
    }));
  };

  const handleGuardar = async () => {
    if (!fechaAsistencia) {
      alert("Por favor, selecciona una fecha.");
      return;
    }

    const payload = Object.entries(asistencias).map(
      ([idAprendiz, tipoAsistencia]) => ({
        fecha_asistencia: fechaAsistencia,
        aprendiz_idaprendiz: parseInt(idAprendiz),
        tipo_asistencia_idtipo_asistencia: parseInt(tipoAsistencia),
      })
    );

    try {
      const res = await fetch("http://localhost:8000/crear-asistencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ asistencias: payload }),
      });

      const data = await res.json();
      alert(data.msg || "Asistencia guardada correctamente");
      setMostrarModal(false);
      setAsistencias({});
      setFechaAsistencia("");
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
      alert("Error al guardar asistencia.");
    }
  };
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2
        style={{
          textAlign: "center",
          color: "#2e7d32",
          marginBottom: "0.5rem",
        }}
      >
        Bienvenido Instructor
      </h2>
      <h3
        style={{ textAlign: "center", color: "#388e3c", marginBottom: "2rem" }}
      >
        Selecciona una ficha:
      </h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {fichas.map((ficha) => (
          <div
            key={ficha.idficha}
            onClick={() => {
              setFichaSeleccionada(ficha.idficha);
              setMostrarModal(true);
            }}
            style={{
              cursor: "pointer",
              border: "1px solid #a5d6a7",
              borderRadius: "12px",
              padding: "4rem",
              minWidth: "250px", // antes: 200px
              backgroundColor: "#e8f5e9",
              boxShadow: "0 4px 10px rgba(76, 175, 80, 0.2)",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <strong style={{ color: "#2e7d32" }}>Programa:</strong>
            <p>{ficha.nombre_programa}</p>
            <strong style={{ color: "#388e3c" }}>Ficha:</strong>
            <p>{ficha.codigo_ficha}</p>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "900px",
              boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
              maxHeight: "calc(100vh - 4rem)",
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#2e7d32" }}>
              Selecciona la fecha de asistencia:
            </h3>
            <input
              type="date"
              value={fechaAsistencia}
              onChange={(e) => setFechaAsistencia(e.target.value)}
              style={{
                marginBottom: "1.5rem",
                padding: "0.75rem 1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "20px",
                width: "250px",
              }}
            />

            <h3 style={{ marginBottom: "1rem" }}>
              Aprendices de la ficha{" "}
              <span style={{ color: "#388e3c" }}>{fichaSeleccionada}</span>
            </h3>

            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead style={{ backgroundColor: "#c8e6c9", color: "#1b5e20" }}>
                <tr>
                  <th>Nombre</th>
                  <th>Documento</th>
                  <th>Email</th>
                  <th>Asistencia</th>
                </tr>
              </thead>
              <tbody>
                {aprendices.map((aprendiz) => (
                  <tr key={aprendiz.idaprendiz}>
                    <td>{aprendiz.nombres_aprendiz}</td>
                    <td>{aprendiz.documento_aprendiz}</td>
                    <td>{aprendiz.email_aprendiz}</td>
                    <td>
                      <select
                        onChange={(e) =>
                          handleAsistenciaChange(
                            aprendiz.idaprendiz,
                            e.target.value
                          )
                        }
                        defaultValue=""
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "1rem",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <option value="">--</option>
                        <option value="1">Presente</option>
                        <option value="2">Tarde</option>
                        <option value="3">Ausente</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <button
                onClick={() => setMostrarModal(false)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#eeeeee",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#43a047",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Guardar Asistencia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsistenciaForm;
