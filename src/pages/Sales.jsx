export default function Sales() {
  return (
    <>
      <div className="container-fluid">
        {/* Encabezado */}
        <div className="row mb-3 bg-light p-2">
          <div className="col-lg-4">
            <h4 className="m-0">PUNTO DE VENTA</h4>
          </div>
          <div className="col-lg-8 text-end">
            <span className="me-3" style={{ fontSize: 18 }}>
              <strong>Vendedor:</strong> Usuario Actual
            </span>
            <span style={{ fontSize: 18 }}>
              <strong>Caja:</strong> CAJA-01
            </span>
          </div>
        </div>

        {/* Cuerpo - 2 Columnas */}
        <div className="row">
          {/* Columna Izquierda - Productos */}
          <div className="col-lg-8">
            {/* Barra de búsqueda */}
            <div className="row mb-3">
              <div className="col-lg-12 p-2">
                <div className="input-group">
                  <input
                    className="input-text form-control"
                    id="txtSearch"
                    type="text"
                    placeholder="Buscar por código o nombre..."
                    autoFocus
                  />
                  <button className="btn btn-primary">
                    <i className="bi bi-upc-scan"></i> Escanear
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <table className="table table-bordered">
                    <thead className="sticky-top bg-light">
                      <tr>
                        <th width="15%">Código</th>
                        <th width="40%">Producto</th>
                        <th width="15%">P. Unitario</th>
                        <th width="15%">Cantidad</th>
                        <th width="15%">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Ejemplo de fila de producto */}
                      <tr>
                        <td>PROD-001</td>
                        <td>Laptop HP 15</td>
                        <td>$12,500.00</td>
                        <td>
                          <input
                            className="input-text form-control text-center"
                            type="number"
                            min="1"
                            defaultValue="1"
                            style={{ width: "60px" }}
                          />
                        </td>
                        <td>$12,500.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Resumen */}
          <div className="col-lg-4">
            {/* Datos del cliente */}
            <div className="row mb-3">
              <div className="col-lg-12 p-2 bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <label style={{ fontSize: 18 }}>Cliente:</label>
                  <button className="btn btn-sm btn-outline-primary">
                    Seleccionar
                  </button>
                </div>
                <input
                  className="input-text form-control mt-2"
                  id="txtCliente"
                  type="text"
                  placeholder="Cliente general"
                  disabled
                />
              </div>
            </div>

            {/* Totales */}
            <div className="row mb-3">
              <div className="col-lg-12 p-2 border">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontSize: 16 }}>Subtotal:</span>
                  <span>$0.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontSize: 16 }}>IVA (16%):</span>
                  <span>$0.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontSize: 16 }}>Descuento:</span>
                  <input
                    className="input-text form-control"
                    style={{ width: "100px" }}
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue="0.00"
                  />
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong style={{ fontSize: 20 }}>TOTAL:</strong>
                  <strong style={{ fontSize: 20 }}>$0.00</strong>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="row mb-3">
              <div className="col-lg-12 p-2">
                <label style={{ fontSize: 18 }}>Método de Pago *</label>
                <select className="input-text form-control" id="cmbMetodoPago">
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>
            </div>

            {/* Efectivo */}
            <div className="row mb-3" id="divEfectivo">
              <div className="col-lg-12 p-2">
                <label style={{ fontSize: 18 }}>Efectivo Recibido</label>
                <input
                  className="input-text form-control"
                  id="txtEfectivo"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="row">
              <div className="col-lg-12 p-2 d-grid gap-2">
                <button className="btn btn-danger btn-lg">
                  <i className="bi bi-x-circle"></i> Cancelar Venta
                </button>
                <button className="btn btn-success btn-lg">
                  <i className="bi bi-cash-stack"></i> Cobrar ($0.00)
                </button>
                <button className="btn btn-primary btn-lg">
                  <i className="bi bi-printer"></i> Facturar e Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
