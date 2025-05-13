import { useNavigate } from 'react-router-dom';

export default function Adjustement() {
    const navigate = useNavigate();
  return (
    <>
      <div className="container-fluid">
        {/* Encabezado */}
        <div className="row mb-4 bg-light p-3">
          <div className="col-lg-8">
            <h4 className="m-0">AJUSTE DE INVENTARIO</h4>
          </div>
          <div className="col-lg-4 text-end">
            <span style={{ fontSize: 18 }}>
              <strong>Folio:</strong> AJ-{new Date().getFullYear()}-0001
            </span>
          </div>
        </div>

        {/* Información Básica */}
        <div className="row mb-3">
          <div className="col-lg-3 p-2">
            <label style={{ fontSize: 18 }}>Almacén *</label>
            <select className="input-text form-control" id="cmbWarehouse">
              <option value="">Seleccionar...</option>
              <option value="1">Almacén Central</option>
              <option value="2">Almacén Norte</option>
            </select>
          </div>
          <div className="col-lg-3 p-2">
            <label style={{ fontSize: 18 }}>Tipo de Ajuste *</label>
            <select className="input-text form-control" id="cmbAdjustmentType">
              <option value="increase">Aumento</option>
              <option value="decrease">Disminución</option>
              <option value="transfer">Transferencia</option>
              <option value="correction">Corrección</option>
            </select>
          </div>
          <div className="col-lg-3 p-2">
            <label style={{ fontSize: 18 }}>Fecha *</label>
            <input
              className="input-text form-control"
              id="txtDate"
              type="datetime-local"
            />
          </div>
          <div className="col-lg-3 p-2">
            <label style={{ fontSize: 18 }}>Responsable *</label>
            <input
              className="input-text form-control"
              id="txtResponsible"
              type="text"
              value="Usuario Actual"
              readOnly
            />
          </div>
        </div>

        {/* Motivo y Referencia */}
        <div className="row mb-3">
          <div className="col-lg-6 p-2">
            <label style={{ fontSize: 18 }}>Motivo *</label>
            <select className="input-text form-control" id="cmbReason">
              <option value="">Seleccionar...</option>
              <option value="damage">Daño/Merma</option>
              <option value="donation">Donación</option>
              <option value="count">Conteo físico</option>
              <option value="expiration">Caducidad</option>
            </select>
          </div>
          <div className="col-lg-6 p-2">
            <label style={{ fontSize: 18 }}>Referencia</label>
            <input
              className="input-text form-control"
              id="txtReference"
              type="text"
              placeholder="N° de documento relacionado"
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
                    <th width="15%">Código</th>
                    <th width="10%">Stock Actual</th>
                    <th width="10%">Cantidad *</th>
                    <th width="10%">Nuevo Stock</th>
                    <th width="15%">Costo Unitario</th>
                    <th width="10%">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Fila de ejemplo */}
                  <tr>
                    <td>1</td>
                    <td>
                      <select className="input-text form-control">
                        <option value="">Buscar producto...</option>
                        <option value="1">Laptop HP Pavilion 15</option>
                      </select>
                    </td>
                    <td>PROD-001</td>
                    <td>8</td>
                    <td>
                      <input
                        className="input-text form-control text-center"
                        type="number"
                        min="1"
                        defaultValue="1"
                      />
                    </td>
                    <td>9</td>
                    <td>
                      <input
                        className="input-text form-control text-end"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue="12500.00"
                      />
                    </td>
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

        {/* Resumen y Comentarios */}
        <div className="row mb-4">
          <div className="col-lg-6 p-2">
            <label style={{ fontSize: 18 }}>Comentarios</label>
            <textarea
              className="input-text form-control"
              id="txtComments"
              rows="3"
              placeholder="Detalles adicionales del ajuste..."
            ></textarea>
          </div>
          <div className="col-lg-6 p-2">
            <div className="border bg-light p-3">
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Total Items:</span>
                <span>1</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Diferencia Total:</span>
                <span className="text-success">+1</span>
              </div>
              <div className="d-flex justify-content-between">
                <span style={{ fontSize: 16 }}>Impacto Económico:</span>
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
            >
              <i className="bi bi-file-earmark"></i> Guardar Borrador
            </button>
            <button
              className="btn btn-success"
              style={{ padding: "8px 20px", fontSize: 16 }}
            >
              <i className="bi bi-check-circle"></i> Aplicar Ajuste
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
