export default function PurchaseOrders() {
  return (
    <>
      <div className="container-fluid">
        {/* Encabezado de la Orden */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <h4 className="mb-3">Order Information</h4>
          </div>

          {/* Número de Orden */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Order Number *</label>
            <input
              className="input-text form-control"
              id="txtOrderNumber"
              type="text"
              placeholder="PO-2023-0001"
              disabled
            />
          </div>

          {/* Fecha de Orden */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Order Date *</label>
            <input
              className="input-text form-control"
              id="txtOrderDate"
              type="date"
            />
          </div>

          {/* Fecha Esperada de Entrega */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Expected Delivery *</label>
            <input
              className="input-text form-control"
              id="txtExpectedDelivery"
              type="date"
            />
          </div>

          {/* Proveedor */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Supplier *</label>
            <select className="input-text form-control" id="cmbSupplier">
              <option value="">Select Supplier...</option>
              <option value="1">Proveedor A</option>
              <option value="2">Proveedor B</option>
            </select>
          </div>

          {/* Estado de la Orden */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Status</label>
            <select className="input-text form-control" id="cmbStatus" disabled>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Almacén de Destino */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Warehouse *</label>
            <select className="input-text form-control" id="cmbWarehouse">
              <option value="">Select Warehouse...</option>
              <option value="1">Almacén Central</option>
              <option value="2">Almacén Norte</option>
            </select>
          </div>
        </div>

        {/* Línea de Productos */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <h4 className="mb-3">Order Items</h4>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Tax</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="input-text form-control"
                        id="cmbProduct1"
                      >
                        <option value="">Select Product...</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="input-text form-control"
                        type="text"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        className="input-text form-control"
                        type="number"
                        min="1"
                        defaultValue="1"
                      />
                    </td>
                    <td>
                      <input
                        className="input-text form-control"
                        type="number"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td>
                      <select className="input-text form-control">
                        <option value="0">0%</option>
                        <option value="16">16%</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="input-text form-control"
                        type="text"
                        disabled
                      />
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm">×</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="btn btn-secondary mt-2">+ Add Item</button>
          </div>
        </div>

        {/* Resumen de la Orden */}
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="p-3">
              <label style={{ fontSize: 18 }}>Notes</label>
              <textarea
                className="input-text form-control"
                id="txtNotes"
                rows="3"
                placeholder="Special instructions..."
              ></textarea>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="p-3 border bg-light">
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Subtotal:</span>
                <span>$0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Tax:</span>
                <span>$0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Shipping:</span>
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
                <strong style={{ fontSize: 18 }}>Total:</strong>
                <strong>$0.00</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="row mb-4">
          <div className="col-lg-12 d-flex justify-content-end">
            <button
              className="btn btn-secondary me-2"
              style={{ padding: "8px 20px", fontSize: 16 }}
            >
              Save Draft
            </button>
            <button
              className="btn btn-success me-2"
              style={{ padding: "8px 20px", fontSize: 16 }}
            >
              Approve Order
            </button>
            <button
              className="btn btn-primary"
              style={{ padding: "8px 20px", fontSize: 16 }}
            >
              Process Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
