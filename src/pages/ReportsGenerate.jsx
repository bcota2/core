import { useNavigate, useLocation } from 'react-router-dom';

function ReportGenerator() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultType = queryParams.get('type') || '';

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="row mb-4 bg-light p-3">
        <div className="col-lg-8">
          <h4 className="m-0">GENERAR NUEVO REPORTE</h4>
        </div>
        <div className="col-lg-4 text-end">
          <span style={{ fontSize: 18 }}>
            <strong>Usuario:</strong> Admin
          </span>
        </div>
      </div>

      {/* Formulario de Configuración */}
      <div className="row mb-3">
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Nombre del Reporte *</label>
          <input
            className="input-text form-control"
            id="txtReportName"
            type="text"
            placeholder="Ej: Valuación Q4 2023"
          />
        </div>
        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Tipo de Reporte *</label>
          <select 
            className="input-text form-control" 
            id="cmbReportType"
            defaultValue={defaultType}
          >
            <option value="">Seleccionar...</option>
            <option value="stock">Stock Actual</option>
            <option value="movements">Movimientos</option>
            <option value="valuation">Valuación</option>
            <option value="expiration">Caducidades</option>
            <option value="sales">Ventas</option>
            <option value="performance">Desempeño</option>
          </select>
        </div>
        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Formato *</label>
          <select className="input-text form-control" id="cmbFormat">
            <option value="pdf">PDF</option>
            <option value="excel">Excel (XLSX)</option>
            <option value="csv">CSV</option>
            <option value="all">Todos los formatos</option>
          </select>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div className="row mb-3 border-top pt-3">
        <div className="col-lg-12">
          <h5 className="mb-3">FILTROS AVANZADOS</h5>
        </div>

        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Rango de Fechas</label>
          <div className="input-group">
            <input
              className="input-text form-control"
              type="date"
              id="txtStartDate"
            />
            <span className="input-group-text">a</span>
            <input
              className="input-text form-control"
              type="date"
              id="txtEndDate"
            />
          </div>
        </div>

        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Almacén</label>
          <select className="input-text form-control" id="cmbWarehouse">
            <option value="">Todos</option>
            <option value="1">Almacén Central</option>
            <option value="2">Almacén Norte</option>
          </select>
        </div>

        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Categoría</label>
          <select className="input-text form-control" id="cmbCategory">
            <option value="">Todas</option>
            <option value="1">Electrónicos</option>
            <option value="2">Refacciones</option>
          </select>
        </div>

        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Estado</label>
          <select className="input-text form-control" id="cmbStatus">
            <option value="">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Opciones Específicas */}
      <div className="row mb-3 border-top pt-3">
        <div className="col-lg-12">
          <h5 className="mb-3">OPCIONES ADICIONALES</h5>
        </div>

        <div className="col-lg-4 p-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="chkIncludeImages"
            />
            <label className="form-check-label" style={{ fontSize: 16 }}>
              Incluir imágenes de productos
            </label>
          </div>
        </div>

        <div className="col-lg-4 p-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="chkGroupByCategory"
              checked
            />
            <label className="form-check-label" style={{ fontSize: 16 }}>
              Agrupar por categoría
            </label>
          </div>
        </div>

        <div className="col-lg-4 p-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="chkShowCosts"
            />
            <label className="form-check-label" style={{ fontSize: 16 }}>
              Mostrar costos unitarios
            </label>
          </div>
        </div>
      </div>

      {/* Vista Previa Rápida */}
      <div className="row mb-4 border-top pt-3">
        <div className="col-lg-12">
          <h5 className="mb-3">VISTA PREVIA</h5>
          <div className="border bg-light p-3 text-center">
            <p className="text-muted">
              <i className="bi bi-file-earmark-text" style={{ fontSize: 24 }}></i>
              <br />
              Configura los parámetros para generar una vista previa
            </p>
            <button className="btn btn-outline-primary">
              <i className="bi bi-eye"></i> Generar Vista Previa
            </button>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="row">
        <div className="col-lg-12 d-flex justify-content-end">
          <button
            className="btn btn-outline-secondary me-2"
            style={{ padding: "8px 20px", fontSize: 16 }}
            onClick={() => navigate('/reports')}
          >
            <i className="bi bi-x-circle"></i> Cancelar
          </button>
          <button
            className="btn btn-primary me-2"
            style={{ padding: "8px 20px", fontSize: 16 }}
          >
            <i className="bi bi-file-earmark"></i> Guardar Configuración
          </button>
          <button
            className="btn btn-success"
            style={{ padding: "8px 20px", fontSize: 16 }}
          >
            <i className="bi bi-gear"></i> Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportGenerator;