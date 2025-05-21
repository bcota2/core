import { useNavigate } from "react-router-dom";

export default function Documentation() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container-fluid">
        {/* Encabezado */}
        <div className="row mb-4 bg-light p-3">
          <div className="col-lg-6">
            <h4 className="m-0">GESTIÓN DE INVENTARIO</h4>
          </div>
          <div className="col-lg-6 text-end">
            <div
              className="input-group"
              style={{ width: "300px", float: "right" }}
            >
              <input
                className="input-text form-control"
                type="text"
                placeholder="Buscar producto..."
              />
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div className="row mb-3">
          <div className="col-lg-3 p-2">
            <label style={{ fontSize: 18 }}>Almacén</label>
            <select className="input-text form-control" id="cmbWarehouse">
              <option value="">Todos los almacenes</option>
              <option value="1">Almacén Central</option>
              <option value="2">Almacén Norte</option>
            </select>
          </div>
          <div className="col-lg-3 p-2">
            <label style={{ fontSize: 18 }}>Categoría</label>
            <select className="input-text form-control" id="cmbCategory">
              <option value="">Todas las categorías</option>
              <option value="1">Electrónicos</option>
              <option value="2">Refacciones</option>
            </select>
          </div>
          <div className="col-lg-3 p-2">
            <label style={{ fontSize: 18 }}>Estado Stock</label>
            <select className="input-text form-control" id="cmbStockStatus">
              <option value="">Todos</option>
              <option value="low">Bajo inventario</option>
              <option value="out">Agotados</option>
              <option value="over">Exceso</option>
            </select>
          </div>
          <div className="col-lg-3 p-2 d-flex align-items-end">
            <button className="btn btn-primary w-100">
              <i className="bi bi-funnel"></i> Filtrar
            </button>
          </div>
        </div>

        {/* Listado de Productos */}
        <div className="row mb-3">
          <div className="col-lg-12">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="bg-light">
                  <tr>
                    <th width="10%">Código</th>
                    <th width="25%">Producto</th>
                    <th width="15%">Categoría</th>
                    <th width="10%">Stock</th>
                    <th width="10%">Mínimo</th>
                    <th width="10%">Máximo</th>
                    <th width="10%">Ubicación</th>
                    <th width="10%">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PROD-001</td>
                    <td>Laptop HP Pavilion 15</td>
                    <td>Electrónicos</td>
                    <td className={5 < 10 ? "text-danger fw-bold" : ""}>5</td>
                    <td>10</td>
                    <td>50</td>
                    <td>A1-B2-03</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-box-arrow-in-down"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel de Acciones Rápidas */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="border p-3 bg-light">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-success me-2"
                  onClick={() => navigate("/products/new")}
                >
                  <i className="bi bi-plus-circle"></i> Nuevo Producto
                </button>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => navigate("/inventory/adjustment")}
                >
                  <i className="bi bi-box-seam"></i> Ajuste de Inventario
                </button>
                <button
                  className="btn btn-info me-2"
                  onClick={() => navigate("/inventory/transfer")}
                >
                  <i className="bi bi-arrow-left-right"></i> Transferencia
                </button>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => navigate("/reports")}
                >
                  <i className="bi bi-file-earmark-bar-graph"></i> Reporte
                </button>
                <button className="btn btn-dark">
                  <i className="bi bi-upc-scan"></i> Etiquetas
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Producto (Ejemplo expandido) */}
        <div className="row mb-4 border-top pt-3">
          <div className="col-lg-12">
            <h5 className="mb-3">DETALLE DEL PRODUCTO</h5>
          </div>

          {/* Sección Izquierda */}
          <div className="col-lg-6">
            <div className="row">
              <div className="col-lg-6 p-2">
                <label style={{ fontSize: 18 }}>Código *</label>
                <input
                  className="input-text form-control"
                  id="txtCode"
                  type="text"
                  placeholder="PROD-001"
                />
              </div>
              <div className="col-lg-6 p-2">
                <label style={{ fontSize: 18 }}>Código de Barras</label>
                <input
                  className="input-text form-control"
                  id="txtBarcode"
                  type="text"
                  placeholder="750123456789"
                />
              </div>
              <div className="col-lg-12 p-2">
                <label style={{ fontSize: 18 }}>Nombre *</label>
                <input
                  className="input-text form-control"
                  id="txtName"
                  type="text"
                  placeholder="Nombre completo del producto"
                />
              </div>
              <div className="col-lg-6 p-2">
                <label style={{ fontSize: 18 }}>Categoría *</label>
                <select className="input-text form-control" id="cmbCategory">
                  <option value="">Seleccionar...</option>
                  <option value="1">Electrónicos</option>
                </select>
              </div>
              <div className="col-lg-6 p-2">
                <label style={{ fontSize: 18 }}>Unidad de Medida *</label>
                <select className="input-text form-control" id="cmbUnit">
                  <option value="PZA">Pieza (PZA)</option>
                  <option value="KG">Kilogramo (KG)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección Derecha */}
          <div className="col-lg-6">
            <div className="row">
              <div className="col-lg-4 p-2">
                <label style={{ fontSize: 18 }}>Stock Mínimo *</label>
                <input
                  className="input-text form-control"
                  id="txtMinStock"
                  type="number"
                  min="0"
                  defaultValue="10"
                />
              </div>
              <div className="col-lg-4 p-2">
                <label style={{ fontSize: 18 }}>Stock Máximo</label>
                <input
                  className="input-text form-control"
                  id="txtMaxStock"
                  type="number"
                  min="0"
                  defaultValue="100"
                />
              </div>
              <div className="col-lg-4 p-2">
                <label style={{ fontSize: 18 }}>Ubicación</label>
                <input
                  className="input-text form-control"
                  id="txtLocation"
                  type="text"
                  placeholder="A1-B2-03"
                />
              </div>
              <div className="col-lg-6 p-2">
                <label style={{ fontSize: 18 }}>Precio de Compra</label>
                <input
                  className="input-text form-control"
                  id="txtCost"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="col-lg-6 p-2">
                <label style={{ fontSize: 18 }}>Precio de Venta *</label>
                <input
                  className="input-text form-control"
                  id="txtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="col-lg-12 p-2">
                <label style={{ fontSize: 18 }}>Proveedor Principal</label>
                <select className="input-text form-control" id="cmbSupplier">
                  <option value="">Seleccionar...</option>
                  <option value="1">Distribuidora Electrónica</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones de Guardado */}
          <div className="col-lg-12 p-2 text-end">
            <button className="btn btn-outline-secondary me-2">Cancelar</button>
            <button className="btn btn-primary">Guardar Producto</button>
          </div>
        </div>
      </div>
    </>
  );
}
