import { useNavigate } from 'react-router-dom';

function InventoryTransfer() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="row mb-4 bg-light p-3">
        <div className="col-lg-8">
          <h4 className="m-0">TRANSFERENCIA ENTRE ALMACENES</h4>
        </div>
        <div className="col-lg-4 text-end">
          <span style={{ fontSize: 18 }}>
            <strong>Folio:</strong> TR-{new Date().getFullYear()}-0001
          </span>
        </div>
      </div>

      {/* Información Básica */}
      <div className="row mb-3">
        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Almacén Origen *</label>
          <select className="input-text form-control" id="cmbOrigin">
            <option value="">Seleccionar...</option>
            <option value="1">Almacén Central</option>
            <option value="2">Almacén Norte</option>
          </select>
        </div>
        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Almacén Destino *</label>
          <select className="input-text form-control" id="cmbDestination">
            <option value="">Seleccionar...</option>
            <option value="1">Almacén Central</option>
            <option value="2">Almacén Norte</option>
          </select>
        </div>
        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Fecha *</label>
          <input
            className="input-text form-control"
            id="txtDate"
            type="datetime-local"
          />
        </div>
      </div>

      {/* Responsable y Referencia */}
      <div className="row mb-3">
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Responsable *</label>
          <input
            className="input-text form-control"
            id="txtResponsible"
            type="text"
            value="Usuario Actual"
            readOnly
          />
        </div>
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Referencia</label>
          <input
            className="input-text form-control"
            id="txtReference"
            type="text"
            placeholder="N° de documento/orden relacionada"
          />
        </div>
      </div>

      {/* Detalle de Productos */}
      <div className="row mb-3">
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="bg-light">
                <tr>
                  <th width="5%">#</th>
                  <th width="25%">Producto</th>
                  <th width="10%">Código</th>
                  <th width="10%">Disponible</th>
                  <th width="10%">Cantidad *</th>
                  <th width="10%">Unidad</th>
                  <th width="15%">Costo Unitario</th>
                  <th width="15%">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <select className="input-text form-control">
                      <option value="">Buscar producto...</option>
                      <option value="1">Laptop HP Pavilion 15</option>
                    </select>
                  </td>
                  <td>PROD-001</td>
                  <td>15</td>
                  <td>
                    <input
                      className="input-text form-control text-center"
                      type="number"
                      min="1"
                      max="15"
                      defaultValue="1"
                    />
                  </td>
                  <td>PZA</td>
                  <td>$12,500.00</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="btn btn-secondary mt-2">
            <i className="bi bi-plus-circle"></i> Agregar Producto
          </button>
        </div>
      </div>

      {/* Comentarios y Resumen */}
      <div className="row mb-4">
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Instrucciones Especiales</label>
          <textarea
            className="input-text form-control"
            id="txtComments"
            rows="3"
            placeholder="Ej: Manejar con cuidado, producto frágil..."
          ></textarea>
        </div>
        <div className="col-lg-6 p-2">
          <div className="border bg-light p-3">
            <div className="d-flex justify-content-between mb-2">
              <span style={{ fontSize: 16 }}>Total Productos:</span>
              <span>1</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ fontSize: 16 }}>Items a Transferir:</span>
              <span>1</span>
            </div>
            <div className="d-flex justify-content-between">
              <span style={{ fontSize: 16 }}>Valor Total:</span>
              <span>$12,500.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="row">
        <div className="col-lg-12 d-flex justify-content-end">
          <button
            className="btn btn-outline-secondary me-2"
            style={{ padding: "8px 20px", fontSize: 16 }}
            onClick={() => navigate('/inventory')}
          >
            <i className="bi bi-x-circle"></i> Cancelar
          </button>
          <button
            className="btn btn-primary me-2"
            style={{ padding: "8px 20px", fontSize: 16 }}
            onClick={() => navigate('/inventory/transfer/draft')}
          >
            <i className="bi bi-file-earmark"></i> Guardar Borrador
          </button>
          <button
            className="btn btn-success"
            style={{ padding: "8px 20px", fontSize: 16 }}
            onClick={() => navigate('/inventory/transfer/confirm')}
          >
            <i className="bi bi-check-circle"></i> Procesar Transferencia
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryTransfer;