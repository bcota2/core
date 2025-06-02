import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Reports() {
  const navigate = useNavigate();

  //Select Categorias
  const [categorias, setCategorias] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/api/categories/for/products")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => Swal.fire("Error Cargando Categorias", err, "error"));
  }, []);

  //Filtros de búsqueda
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroAlmacen, setFiltroAlmacen] = useState("");
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFin, setFiltroFin] = useState("");

  // Estados del formulario
  const [reportType, setReportType] = useState("");
  const [reportName, setReportName] = useState("");
  const [format, setFormat] = useState("pdf");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [category, setCategory] = useState("");

  const handleGenerateReport = async () => {
    const payload = {
      tipo: reportType,
      nombre: reportName,
      formato: format,
      fecha_inicio: startDate,
      fecha_fin: endDate,
      almacen: warehouse,
      categoria: category,
    };

    try {
      const res = await fetch("http://localhost:3001/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Reporte generado correctamente.");
        window.location.reload(); // o setear lista actualizada
      } else {
        alert("Hubo un error al generar el reporte.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Tabla dinamica de reportes
  const [reportes, setReportes] = useState([]);

  const fetchReportes = async () => {
    const params = new URLSearchParams();

    if (filtroTipo) params.append("tipo", filtroTipo);
    if (filtroAlmacen) params.append("almacen", filtroAlmacen);
    if (filtroInicio) params.append("inicio", filtroInicio);
    if (filtroFin) params.append("fin", filtroFin);

    const res = await fetch(
      `http://localhost:3001/api/reports?${params.toString()}`
    );
    const data = await res.json();
    setReportes(data);
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  return (
    <div className="row mb-4 border-top pt-4">
      <div className="col-lg-12">
        <h5 className="mb-3">GENERAR NUEVO REPORTE</h5>
      </div>

      <div className="col-lg-4 p-2">
        <label style={{ fontSize: 18 }}>Tipo de Reporte *</label>
        <select
          className="form-control"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="">Todos...</option>
          <option value="stock">Stock Actual</option>
          <option value="movements">Movimientos</option>
          <option value="valuation">Valuación</option>
          <option value="expiration">Caducidades</option>
          <option value="sales">Ventas por Producto</option>
        </select>
      </div>

      <div className="col-lg-4 p-2">
        <label style={{ fontSize: 18 }}>Nombre del Reporte *</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ej: Reporte Mensual Noviembre"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
        />
      </div>

      <div className="col-lg-4 p-2">
        <label style={{ fontSize: 18 }}>Formato *</label>
        <select
          className="form-control"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
          <option value="both">Ambos</option>
        </select>
      </div>

      <div className="col-lg-12 p-2">
        <div className="border bg-light p-3">
          <div className="row">
            <div className="col-lg-3 p-2">
              <label style={{ fontSize: 18 }}>Rango de Fechas</label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <span className="input-group-text">a</span>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-3 p-2">
              <label style={{ fontSize: 18 }}>Almacén</label>
              <select
                className="form-control"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              >
                <option value="">Todos...</option>
                <option value="1">Almacén Central</option>
                <option value="2">Almacén Norte</option>
              </select>
            </div>

            <div className="col-lg-3 p-2">
              <label style={{ fontSize: 18 }}>Categoría</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {categorias.map((cat) => (
                  <option key={cat.CategoriaID} value={cat.CategoriaID}>
                    {cat.Nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-3 p-2 d-flex align-items-center justify-content-center">
              <button className="btn btn-primary me-2" onClick={fetchReportes}>
                <i className="bi bi-funnel"></i> Aplicar Filtros
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFiltroTipo("");
                  setFiltroAlmacen("");
                  setFiltroInicio("");
                  setFiltroFin("");
                  fetchReportes();
                }}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Restablecer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Reportes */}

      <div className="row mb-3">
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="bg-light">
                <tr>
                  <th width="15%">Fecha Generación</th>
                  <th width="20%">Nombre</th>
                  <th width="15%">Tipo</th>
                  <th width="15%">Rango Fechas</th>
                  <th width="15%">Generado Por</th>
                  <th width="20%">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reportes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay reportes disponibles.
                    </td>
                  </tr>
                ) : (
                  reportes.map((r) => (
                    <tr key={r.id}>
                      <td>{r.fecha_generacion}</td>
                      <td>{r.nombre}</td>
                      <td>{r.tipo}</td>
                      <td>{r.rango_fechas}</td>
                      <td>{r.generado_por}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => navigate(`/reports/view/${r.id}`)}
                        >
                          <i className="bi bi-eye"></i> Ver
                        </button>
                        {r.formato.includes("pdf") && (
                          <a
                            href={`/api/reports/download/pdf/${r.id}`}
                            className="btn btn-sm btn-outline-secondary me-1"
                          >
                            <i className="bi bi-download"></i> PDF
                          </a>
                        )}
                        {r.formato.includes("excel") && (
                          <a
                            href={`/api/reports/download/excel/${r.id}`}
                            className="btn btn-sm btn-outline-success"
                          >
                            <i className="bi bi-file-excel"></i> Excel
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="col-lg-12 p-2 d-flex justify-content-end">
        <button
          className="btn btn-outline-secondary me-2"
          style={{ padding: "8px 20px", fontSize: 16 }}
          onClick={() => navigate("/inventory")}
        >
          <i className="bi bi-x-circle"></i> Cancelar
        </button>
        <button
          className="btn btn-primary"
          style={{ padding: "8px 20px", fontSize: 16 }}
          onClick={handleGenerateReport}
        >
          <i className="bi bi-gear"></i> Generar Reporte
        </button>
      </div>
    </div>
  );
}

export default Reports;
