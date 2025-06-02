import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function PurchaseOrders() {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [orderItems, setOrderItems] = useState([]);
  const [shipping, setShipping] = useState(0);

  const [orderDate, setOrderDate] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [warehouseID, setWarehouseID] = useState("");
  const [notes, setNotes] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/suppliers")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => Swal.fire("Error Cargando Proveedores", err, "error"));

    const url = new URL("http://localhost:3001/api/products/filter");

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setProductos([]);
          console.error("Respuesta no válida:", data);
        } else {
          setProductos(data);
        }
      })
      .catch((err) => Swal.fire("Error Cargando Productos", err, "error"));
  }, []);

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      {
        productoID: "",
        sku: "",
        quantity: 1,
        unitCost: 0,
        tax: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const items = [...orderItems];
    items.splice(index, 1);
    setOrderItems(items);
  };

  const handleItemChange = (index, field, value) => {
    const items = [...orderItems];
    items[index][field] = value;

    // Si cambia cantidad, costo o tax, recalcula total
    const qty = parseFloat(items[index].quantity) || 0;
    const price = parseFloat(items[index].unitCost) || 0;
    const taxRate = parseFloat(items[index].tax) || 0;

    const subtotal = qty * price;
    const tax = (subtotal * taxRate) / 100;
    items[index].total = parseFloat((subtotal + tax).toFixed(2));

    setOrderItems(items);
  };

  const handleProductChange = (index, productID) => {
    const producto = productos.find((p) => p.ProductoID == productID);
    const items = [...orderItems];
    items[index].productoID = productID;
    items[index].sku = producto?.Codigo || "";
    items[index].unitCost = producto?.PrecioCompra || 0;
    handleItemChange(index, "unitCost", producto?.PrecioCompra || 0);
  };

  const calcularTotales = () => {
    let subtotal = 0;
    let taxTotal = 0;

    orderItems.forEach((item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitCost) || 0;
      const taxRate = parseFloat(item.tax) || 0;

      const totalSinImpuesto = qty * price;
      const impuesto = (totalSinImpuesto * taxRate) / 100;

      subtotal += totalSinImpuesto;
      taxTotal += impuesto;
    });

    return {
      subtotal: subtotal.toFixed(2),
      tax: taxTotal.toFixed(2),
      total: (subtotal + taxTotal + parseFloat(shipping || 0)).toFixed(2),
    };
  };
  const { subtotal, tax, total } = calcularTotales();

  const handleSaveOrder = async (status = "Draft") => {
    if (
      !orderDate ||
      !expectedDelivery ||
      !supplierID ||
      !warehouseID ||
      orderItems.length === 0
    ) {
      Swal.fire(
        "Faltan datos",
        "Completa todos los campos requeridos y agrega productos.",
        "warning"
      );
      return;
    }

    const body = {
      orderNumber,
      orderDate,
      expectedDelivery,
      supplierID,
      warehouseID,
      notes,
      shipping: parseFloat(shipping) || 0,
      status, // puede ser "Draft" o "Approved"
      items: orderItems.map((item) => ({
        productoID: item.productoID,
        sku: item.sku,
        quantity: parseFloat(item.quantity),
        unitCost: parseFloat(item.unitCost),
        tax: parseFloat(item.tax),
        total: parseFloat(item.total),
      })),
    };

    try {
      const res = await fetch("http://localhost:3001/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("No se pudo guardar la orden");

      Swal.fire(
        "Éxito",
        `Orden ${
          status === "Approved" ? "aprobada" : "guardada como borrador"
        }`,
        "success"
      );
      navigate("/purchase-orders");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/purchase-orders/next-number")
      .then((res) => res.json())
      .then((data) => setOrderNumber(data.nextOrderNumber))
      .catch((err) =>
        Swal.fire("Error generando número de orden", err.message, "error")
      );
  }, []);

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
              id="txtOrderNumber"
              className="input-text form-control"
              type="text"
              value={orderNumber}
              disabled
            />
          </div>

          {/* Fecha de Orden */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Order Date *</label>
            <input
              id="txtOrderDate"
              className="input-text form-control"
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>

          {/* Fecha Esperada de Entrega */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Expected Delivery *</label>
            <input
              id="txtExpectedDelivery"
              className="input-text form-control"
              type="date"
              value={expectedDelivery}
              onChange={(e) => setExpectedDelivery(e.target.value)}
            />
          </div>

          {/* Proveedor */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Supplier *</label>
            <select
              id="selSupplier"
              className="input-text form-control form-select"
              value={supplierID}
              onChange={(e) => setSupplierID(e.target.value)}
            >
              <option value="">Select Supplier...</option>
              {proveedores.map((cat) => (
                <option key={cat.ProveedorID} value={cat.ProveedorID}>
                  {cat.Nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Estado de la Orden */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Status</label>
            <select
              id="selStatus"
              className="input-text form-control "
              disabled
            >
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Almacén de Destino */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Warehouse *</label>
            <select
              id="selWarehouse"
              className="input-text form-control form-select"
              value={warehouseID}
              onChange={(e) => setWarehouseID(e.target.value)}
            >
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
                <thead className="text-center">
                  <tr>
                    <th style={{ width: "40%" }}>Product</th>
                    <th width="12%">SKU</th>
                    <th width="8%">Quantity</th>
                    <th>Unit Cost</th>
                    <th width="10%">Tax</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody className="text-center">
                  {orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          className="form-select"
                          value={item.productoID}
                          onChange={(e) =>
                            handleProductChange(index, e.target.value)
                          }
                        >
                          <option value="">Select Product...</option>
                          {productos.map((prod) => (
                            <option
                              key={prod.ProductoID}
                              value={prod.ProductoID}
                            >
                              {prod.Nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={item.sku}
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.quantity}
                          min="1"
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="number"
                          value={item.unitCost}
                          disabled
                        />
                      </td>
                      <td>
                        <select
                          className="form-select"
                          value={item.tax}
                          onChange={(e) =>
                            handleItemChange(index, "tax", e.target.value)
                          }
                        >
                          <option value="0">0%</option>
                          <option value="16">16%</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={`$${item.total.toFixed(2)}`}
                          disabled
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              id="btnAddItem"
              className="btn btn-secondary mt-2"
              onClick={handleAddItem}
            >
              + Add Item
            </button>
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="p-3 border bg-light">
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Tax:</span>
                <span>${tax}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: 16 }}>Shipping:</span>
                <input
                  className="form-control"
                  style={{ width: "100px" }}
                  type="number"
                  min="0"
                  step="0.01"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                />
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong style={{ fontSize: 18 }}>Total:</strong>
                <strong>${total}</strong>
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
              onClick={() => handleSaveOrder("Draft")}
            >
              Save Draft
            </button>
            <button
              className="btn btn-success me-2"
              style={{ padding: "8px 20px", fontSize: 16 }}
              onClick={() => handleSaveOrder("Approved")}
            >
              Approve Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function PurchaseOrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/purchase-orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) =>
        Swal.fire("Error al cargar órdenes", err.message, "error")
      );
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Purchase Orders</h3>
      <table className="table table-bordered">
        <thead className="text-center">
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6">No orders found.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.PurchaseOrderID}>
                <td>{order.OrderNumber}</td>
                <td>{order.OrderDate}</td>
                <td>{order.SupplierName}</td>
                <td>
                  <span
                    className={`text-center badge ${
                      order.Status === "Draft"
                        ? "bg-warning"
                        : order.Status === "Approved"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {order.Status}
                  </span>
                </td>
                <td>${order.Total.toFixed(2)}</td>
                <td>
                  <Link
                    className="btn btn-sm btn-primary"
                    to={`/purchase-orders/view/${order.PurchaseOrderID}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ViewPurchaseOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/purchase-orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order);
        setItems(data.items);
      })
      .catch((err) =>
        Swal.fire("Error", "No se pudo cargar la orden", "error")
      );
  }, [id]);

  const aprobarOrden = async () => {
    const confirm = await Swal.fire({
      title: "¿Aprobar orden?",
      text: "Esta acción cambiará el estado a 'Approved'.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/purchase-orders/${id}/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Approved" }),
        }
      );

      if (!res.ok) throw new Error("No se pudo aprobar la orden");

      Swal.fire("Éxito", "Orden aprobada", "success");
      navigate("/purchase-orders");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const cancelarOrden = async () => {
    const confirm = await Swal.fire({
      title: "¿Cancelar orden?",
      text: "Esta acción marcará la orden como 'Cancelled'.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/purchase-orders/${id}/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Cancelled" }),
        }
      );

      if (!res.ok) throw new Error("No se pudo cancelar la orden");

      Swal.fire("Orden cancelada", "", "error");
      navigate("/purchase-orders");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (!order) return <div className="container mt-4">Cargando orden...</div>;

  return (
    <div className="container mt-4">
      <h3>Orden: {order.OrderNumber}</h3>
      <p>
        <strong>Fecha:</strong> {order.OrderDate}
      </p>
      <p>
        <strong>Estado:</strong> {order.Status}
      </p>
      <p>
        <strong>Notas:</strong> {order.Notes}
      </p>

      <table className="table table-bordered mt-4">
        <thead className="text-center">
          <tr>
            <th>ID</th>
            <th width="25%">Producto</th>
            <th>SKU</th>
            <th>Cantidad</th>
            <th>Costo Unitario</th>
            <th width="10%">Impuesto (%)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.ProductoID}</td>
              <td>{item.NombreProducto}</td>
              <td>{item.SKU}</td>
              <td>{item.Quantity}</td>
              <td>${item.UnitCost.toFixed(2)}</td>
              <td>{item.Tax}%</td>
              <td>${item.Total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-end mt-3">
        <p>
          <strong>Subtotal:</strong> ${order.Subtotal.toFixed(2)}
        </p>
        <p>
          <strong>Impuestos:</strong> ${order.TaxTotal.toFixed(2)}
        </p>
        <p>
          <strong>Envío:</strong> ${order.Shipping.toFixed(2)}
        </p>
        <h5>
          <strong>Total:</strong> ${order.Total.toFixed(2)}
        </h5>
      </div>

      {(order.Status === "Draft" && (
        <div className="mt-4 d-flex justify-content-end gap-2">
          <button className="btn btn-success" onClick={aprobarOrden}>
            Aprobar Orden
          </button>
          <button className="btn btn-danger" onClick={cancelarOrden}>
            Cancelar Orden
          </button>
          <button
            className="btn btn-outline-info"
            onClick={() => navigate("/purchase-orders")}
          >
            Regresar
          </button>
        </div>
      )) || (
        <div className="mt-4 d-flex justify-content-end gap-2">
          <button
            className="btn btn-outline-info"
            onClick={() => navigate("/purchase-orders")}
          >
            Regresar
          </button>
        </div>
      )}
    </div>
  );
}

export { PurchaseOrders, PurchaseOrdersList, ViewPurchaseOrder };
