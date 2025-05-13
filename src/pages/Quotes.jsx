export default function Quotes() {
  return (
    <div>
      <div className="container-fluid">
        {/* Encabezado de Cotización */}
        <div className="row mb-4 bg-light p-3">
          <div className="col-lg-6">
            <h4 className="m-0">NUEVA COTIZACIÓN</h4>
          </div>
          <div className="col-lg-6 text-end">
            <span className="me-3" style={{ fontSize: 18 }}>
              <strong>Folio:</strong> QT-{new Date().getFullYear()}-0001
            </span>
            <span style={{ fontSize: 18 }}>
              <strong>Fecha:</strong> {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Sección de Información Básica */}
        <div className="row mb-3">
          {/* Cliente */}
          <div className="col-lg-4 p-2">
            <label style={{ fontSize: 18 }}>Cliente *</label>
            <div className="input-group">
              <select className="input-text form-control" id="cmbCliente">
                <option value="">Seleccionar cliente...</option>
                <option value="1">Cliente General</option>
                <option value="2">Empresa ABC, S.A. de C.V.</option>
              </select>
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-plus"></i> Nuevo
              </button>
            </div>
          </div>

          {/* Vendedor */}
          <div className="col-lg-3 p-2">
            <label style={{ fontSize: 18 }}>Vendedor *</label>
            <select className="input-text form-control" id="cmbVendedor">
              <option value="1">Usuario Actual</option>
              <option value="2">Equipo de Ventas</option>
            </select>
          </div>

          {/* Validez */}
          <div className="col-lg-2 p-2">
            <label style={{ fontSize: 18 }}>Validez (días) *</label>
            <select className="input-text form-control" id="cmbValidez">
              <option value="7">7 días</option>
              <option value="15" selected>
                15 días
              </option>
              <option value="30">30 días</option>
            </select>
          </div>

          {/* Moneda */}
          <div className="col-lg-3 p-2">
            <label style={{ fontSize: 18 }}>Moneda *</label>
            <select className="input-text form-control" id="cmbMoneda">
              <option value="MXN" selected>
                MXN - Peso Mexicano
              </option>
              <option value="USD">USD - Dólar Americano</option>
            </select>
          </div>
        </div>

        {/* Línea de Productos */}
        <div className="row mb-3">
          <div className="col-lg-12">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th width="5%">#</th>
                    <th width="10%">Código</th>
                    <th width="30%">Descripción</th>
                    <th width="10%">Unidad</th>
                    <th width="10%">Precio Unitario</th>
                    <th width="10%">Cantidad</th>
                    <th width="10%">Descuento</th>
                    <th width="15%">Total</th>
                    <th width="5%"></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Fila de ejemplo */}
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="input-group">
                        <input
                          className="input-text form-control"
                          type="text"
                          placeholder="PROD-001"
                        />
                        <button className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-search"></i>
                        </button>
                      </div>
                    </td>
                    <td>Laptop HP Pavilion 15</td>
                    <td>PZA</td>
                    <td>$15,999.00</td>
                    <td>
                      <input
                        className="input-text form-control text-center"
                        type="number"
                        min="1"
                        defaultValue="1"
                      />
                    </td>
                    <td>
                      <input
                        className="input-text form-control text-center"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        defaultValue="0"
                      />
                    </td>
                    <td>$15,999.00</td>
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

        {/* Totales y Observaciones */}
        <div className="row">
          {/* Columna Izquierda - Observaciones */}
          <div className="col-lg-8">
            <div className="p-2">
              <label style={{ fontSize: 18 }}>Condiciones Comerciales</label>
              <textarea
                className="input-text form-control"
                id="txtCondiciones"
                rows="3"
                placeholder="Ej: Precios válidos por 15 días, pago 50% anticipado..."
              ></textarea>
            </div>
            <div className="p-2">
              <label style={{ fontSize: 18 }}>Notas Internas</label>
              <textarea
                className="input-text form-control"
                id="txtNotas"
                rows="2"
                placeholder="Información relevante para el equipo de ventas..."
              ></textarea>
            </div>
          </div>

          {/* Columna Derecha - Totales */}
          <div className="col-lg-4">
            <div className="p-2 border bg-light">
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Subtotal:</span>
                <span>$0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Descuento Global:</span>
                <input
                  className="input-text form-control text-end"
                  style={{ width: "100px" }}
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue="0.00"
                />
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>IVA (16%):</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong style={{ fontSize: 20 }}>Total:</strong>
                <strong style={{ fontSize: 20 }}>$0.00</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="row mt-4">
          <div className="col-lg-12 d-flex justify-content-end">
            <button
              className="btn btn-outline-secondary me-2"
              style={{ padding: "8px 20px", fontSize: 16 }}
            >
              <i className="bi bi-file-earmark"></i> Guardar Borrador
            </button>
            <button
              className="btn btn-primary me-2"
              style={{ padding: "8px 20px", fontSize: 16 }}
            >
              <i className="bi bi-check-circle"></i> Guardar Cotización
            </button>
            <button
              className="btn btn-success"
              style={{ padding: "8px 20px", fontSize: 16 }}
            >
              <i className="bi bi-cart-check"></i> Convertir a Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
