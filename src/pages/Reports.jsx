import { useNavigate } from 'react-router-dom';

function Reports() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="row mb-4 bg-light p-3">
        <div className="col-lg-8">
          <h4 className="m-0">REPORTES DE INVENTARIO</h4>
        </div>
        <div className="col-lg-4 text-end">
          <button 
            className="btn btn-success"
            onClick={() => navigate('/reports/generate')}
          >
            <i className="bi bi-file-earmark-plus"></i> Nuevo Reporte
          </button>
        </div>
      </div>

      {/* Filtros Rápidos */}
      <div className="row mb-3">
        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Tipo de Reporte</label>
          <select className="input-text form-control" id="cmbReportType">
            <option value="">Todos</option>
            <option value="stock">Stock Actual</option>
            <option value="movements">Movimientos</option>
            <option value="valuation">Valuación</option>
            <option value="expiration">Caducidades</option>
          </select>
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
          <label style={{ fontSize: 18 }}>Fecha Inicio</label>
          <input
            className="input-text form-control"
            type="date"
            id="txtStartDate"
          />
        </div>
        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Fecha Fin</label>
          <input
            className="input-text form-control"
            type="date"
            id="txtEndDate"
          />
        </div>
      </div>

      {/* Botón Generar */}
      <div className="row mb-4">
        <div className="col-lg-12 text-center">
          <button className="btn btn-primary me-2">
            <i className="bi bi-funnel"></i> Aplicar Filtros
          </button>
          <button className="btn btn-secondary">
            <i className="bi bi-arrow-counterclockwise"></i> Restablecer
          </button>
        </div>
      </div>

      {/* Listado de Reportes Guardados */}
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
                <tr>
                  <td>15/Nov/2023 10:30</td>
                  <td>Reporte Stock Mensual</td>
                  <td>Stock Actual</td>
                  <td>01/Nov - 15/Nov</td>
                  <td>Admin</td>
                  <td className="text-center">
                    <button 
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => navigate('/reports/view/1')}
                    >
                      <i className="bi bi-eye"></i> Ver
                    </button>
                    <button className="btn btn-sm btn-outline-secondary me-1">
                      <i className="bi bi-download"></i> PDF
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                      <i className="bi bi-file-excel"></i> Excel
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Panel de Generación de Reporte */}
      <div className="row mb-4 border-top pt-4">
        <div className="col-lg-12">
          <h5 className="mb-3">GENERAR NUEVO REPORTE</h5>
        </div>

        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Tipo de Reporte *</label>
          <select className="input-text form-control" id="cmbNewReportType">
            <option value="">Seleccionar...</option>
            <option value="stock">Stock Actual</option>
            <option value="movements">Movimientos</option>
            <option value="valuation">Valuación de Inventario</option>
            <option value="expiration">Productos por Caducar</option>
            <option value="sales">Ventas por Producto</option>
          </select>
        </div>

        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Nombre del Reporte *</label>
          <input
            className="input-text form-control"
            id="txtReportName"
            type="text"
            placeholder="Ej: Reporte Mensual Noviembre"
          />
        </div>

        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Formato *</label>
          <select className="input-text form-control" id="cmbFormat">
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="both">Ambos</option>
          </select>
        </div>

        <div className="col-lg-12 p-2">
          <div className="border bg-light p-3">
            <div className="row">
              <div className="col-lg-4 p-2">
                <label style={{ fontSize: 18 }}>Rango de Fechas</label>
                <div className="input-group">
                  <input
                    className="input-text form-control"
                    type="date"
                    id="txtReportStartDate"
                  />
                  <span className="input-group-text">a</span>
                  <input
                    className="input-text form-control"
                    type="date"
                    id="txtReportEndDate"
                  />
                </div>
              </div>

              <div className="col-lg-4 p-2">
                <label style={{ fontSize: 18 }}>Almacén</label>
                <select className="input-text form-control" id="cmbReportWarehouse">
                  <option value="">Todos</option>
                  <option value="1">Almacén Central</option>
                </select>
              </div>

              <div className="col-lg-4 p-2">
                <label style={{ fontSize: 18 }}>Categoría</label>
                <select className="input-text form-control" id="cmbReportCategory">
                  <option value="">Todas</option>
                  <option value="1">Electrónicos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="col-lg-12 p-2 d-flex justify-content-end">
          <button
            className="btn btn-outline-secondary me-2"
            style={{ padding: "8px 20px", fontSize: 16 }}
            onClick={() => navigate('/inventory')}
          >
            <i className="bi bi-x-circle"></i> Cancelar
          </button>
          <button
            className="btn btn-primary"
            style={{ padding: "8px 20px", fontSize: 16 }}
          >
            <i className="bi bi-gear"></i> Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;