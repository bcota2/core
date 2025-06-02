import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Sales() {
  const [clienteID, setClienteID] = useState("");
  const [quoteItems, setQuoteItems] = useState([]);
  const [ventaItems, setVentaItems] = useState([]);
  const [folioQuote, setFolioQuote] = useState("");
  const [clientes, setClientes] = useState([]);
  const [saleNumber, setSaleNumber] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/customers")
      .then((res) => res.json())
      .then((data) => setClientes(data));

    fetch("http://localhost:3001/api/products/filter")
      .then((res) => res.json())
      .then((data) => setProductos(data));
  }, []);

  //Calcular Totales
  const calcularTotales = () => {
    const subtotal = ventaItems.reduce(
      (acc, item) => acc + item.PrecioUnitario * item.Cantidad,
      0
    );
    const iva = (subtotal - descuento) * 0.16;
    const total = subtotal - descuento + iva;

    return {
      subtotal: subtotal.toFixed(2),
      descuentoCalculado: descuento.toFixed(2), // Mostrar el global
      iva: iva.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const { subtotal, descuentoCalculado, iva, total } = calcularTotales();

  //Cargar cotización por folio
  const handleLoadQuote = async (e) => {
    if (e.key === "Enter" && folioQuote.trim()) {
      try {
        const res = await fetch(
          `http://localhost:3001/api/quotes/by-folio/${folioQuote}`
        );
        if (!res.ok) throw new Error("Quote not found");
        const data = await res.json();

        // Mapear productos de cotización al formato de venta
        const productosConvertidos = data.items.map((item) => {
          const precio = parseFloat(item.PrecioUnitario) || 0;
          const Cantidad = parseFloat(item.Cantidad) || 0;
          const descuento = parseFloat(item.DescuentoUnitario) || 0;
          const total = (precio - descuento) * Cantidad;

          return {
            ProductoID: item.ProductoID,
            Codigo: item.Codigo || `PROD-${item.ProductoID}`,
            NombreProducto: item.NombreProducto,
            Unidad: item.Unidad || "PZA",
            PrecioUnitario: precio,
            Cantidad,
            DescuentoUnitario: descuento,
            Total: total,
          };
        });

        // Cargar productos y cliente
        setVentaItems(productosConvertidos);
        setClienteID(data.quote.ClienteID); 
        setFolioQuote(""); // limpia el input

        Swal.fire("Éxito", "Cotización cargada correctamente", "success");
      } catch (err) {
        Swal.fire(
          "Error",
          "No se encontró la cotización o no está finalizada",
          "error"
        );
      }
    }
  };

  // Registrar venta
  const handleRegistrarVenta = async () => {
    const { subtotal, iva, total } = calcularTotales();

    if (!clienteID || ventaItems.length === 0) {
      Swal.fire(
        "Faltan datos",
        "Selecciona un cliente y agrega productos",
        "warning"
      );
      return;
    }

    const metodoPago = document.getElementById("cmbMetodoPago").value;

    const body = {
      clienteID,
      metodoPago,
      total: parseFloat(total),
      descuento: parseFloat(descuento),
      iva: parseFloat(iva),
      productos: ventaItems,
    };

    try {
      const res = await fetch("http://localhost:3001/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Swal.fire("Éxito", "Venta registrada correctamente", "success");
        setVentaItems([]);
        setClienteID("");
        setDescuento(0);
      } else {
        Swal.fire("Error", "No se pudo registrar la venta", "error");
      }
    } catch (err) {
      console.error("Error al registrar venta:", err.message);
      Swal.fire("Error", "Error al conectar con el servidor", "error");
    }
  };

  const handleCancelarVenta = () => {
    setClienteID("");
    setVentaItems([]);
    setFolioQuote("");
    setDescuento(0);
    // Limpiar también valores de inputs directos si usas `document.getElementById`
    const efectivo = document.getElementById("txtEfectivo");
    if (efectivo) efectivo.value = "";
    const metodoPago = document.getElementById("cmbMetodoPago");
    if (metodoPago) metodoPago.value = "efectivo";
  };

  //Agregar Productos
  const handleAgregarProducto = () => {
    setVentaItems([
      ...ventaItems,
      {
        ProductoID: "",
        NombreProducto: "",
        Unidad: "PZA",
        PrecioUnitario: 0,
        Cantidad: 1,
        DescuentoUnitario: 0,
        Total: 0,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const items = [...ventaItems];
    items.splice(index, 1);
    setVentaItems(items);
  };
  return (
    <>
      <div className="container-fluid">
        {/* Encabezado */}
        <div className="row mb-3 bg-light p-2">
          <div className="col-lg-4">
            <h4 className="m-0">POINT OF SALES</h4>
          </div>
          <div className="col-lg-8 text-end">
            <span className="me-3" style={{ fontSize: 18 }}>
              <strong>Seller:</strong> Current User
            </span>
            <div className="d-flex align-items-center justify-content-end">
              <label className="me-2 mb-0" style={{ fontSize: 19 }}>
                <strong>Folio:</strong>
              </label>
              <input
                className="form-control text-center"
                style={{ width: "200px", fontSize: 16 }}
                placeholder="Ex. QT-2025-0003"
                value={folioQuote}
                onChange={(e) => setFolioQuote(e.target.value)}
                onKeyDown={handleLoadQuote}
              />
            </div>
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
                  <select
                    className="form-select"
                    value={selectedProduct}
                    onChange={(e) => {
                      const selectedID = parseInt(e.target.value);
                      const producto = productos.find(
                        (p) => p.ProductoID === selectedID
                      );
                      if (producto) {
                        const precio = parseFloat(producto.PrecioVenta);
                        const nuevoItem = {
                          ProductoID: producto.ProductoID,
                          Codigo: producto.Codigo,
                          NombreProducto: producto.Nombre,
                          Unidad: producto.Unidad || "PZA",
                          PrecioUnitario: precio,
                          Cantidad: 1,
                          DescuentoUnitario: 0,
                          Total: precio, // Esto estaba mal antes como producto.Precio
                        };

                        setVentaItems([...ventaItems, nuevoItem]);
                        setSelectedProduct(""); // ← limpiar select
                      }
                    }}
                  >
                    <option value="">Search by code or name...</option>
                    {productos.map((p) => (
                      <option key={p.ProductoID} value={p.ProductoID}>
                        {p.Codigo} - {p.Nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="row mt-3">
              <div className="col-lg-12">
                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <table className="table table-bordered">
                    <thead className="sticky-top bg-light">
                      <tr>
                        <th width="15%">Code</th>
                        <th width="40%">Product</th>
                        <th width="15%">Unit Price</th>
                        <th width="15%">Quantity</th>
                        <th width="15%">Total</th>
                        <th width="10%">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Ejemplo de fila de producto */}
                      {ventaItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.Codigo || `PROD-${item.productoID}`}</td>
                          <td>{item.NombreProducto}</td>
                          <td>${item.PrecioUnitario.toFixed(2)}</td>
                          <td>
                            <input
                              className="input-text form-control text-center"
                              type="number"
                              min="1"
                              value={item.Cantidad}
                              onChange={(e) => {
                                const newItems = [...ventaItems];
                                newItems[index].Cantidad = parseInt(
                                  e.target.value
                                );
                                newItems[index].Total =
                                  (newItems[index].PrecioUnitario -
                                    (newItems[index].DescuentoUnitario || 0)) *
                                  newItems[index].Cantidad;

                                setVentaItems(newItems);
                              }}
                              style={{ width: "60px" }}
                            />
                          </td>
                          <td>${(item.Total ?? 0).toFixed(2)}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-danger btn-sm "
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
              </div>
            </div>
          </div>

          {/* Columna Derecha - Resumen */}
          <div className="col-lg-4">
            {/* Datos del cliente */}
            <div className="row mb-3">
              <div className="col-lg-12 p-2 bg-light">
                <select
                  className="form-select mt-2"
                  value={clienteID}
                  onChange={(e) => setClienteID(e.target.value)}
                >
                  <option value=""> General Customer </option>
                  {clientes.map((c) => (
                    <option key={c.ClienteID} value={c.ClienteID}>
                      {c.Nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Totales */}
            <div className="row mb-3">
              <div className="col-lg-12 p-2 border">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontSize: 16 }}>Subtotal:</span>
                  <span>${subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontSize: 16 }}>IVA (16%):</span>
                  <span>${iva}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontSize: 16 }}>Discount:</span>
                  <input
                    className="input-text form-control"
                    style={{ width: "100px" }}
                    type="number"
                    min="0"
                    step="0.01"
                    value={descuento}
                    onChange={(e) =>
                      setDescuento(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong style={{ fontSize: 20 }}>TOTAL:</strong>
                  <strong style={{ fontSize: 20 }}>${total}</strong>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="row mb-3">
              <div className="col-lg-12 p-2">
                <label style={{ fontSize: 18 }}>Payment Method *</label>
                <select className="input-text form-control" id="cmbMetodoPago">
                  <option value="Efectivo">Cash</option>
                  <option value="Tarjeta">Debit / Credit</option>
                  <option value="Transferencia">Transfer</option>
                  <option value="Mixto">Both</option>
                </select>
              </div>
            </div>

            {/* Efectivo */}
            <div className="row mb-3" id="divEfectivo">
              <div className="col-lg-12 p-2">
                <label style={{ fontSize: 18 }}>Cash Received</label>
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
                <button
                  className="btn btn-danger btn-lg"
                  onClick={handleCancelarVenta}
                >
                  <i className="bi bi-x-circle"></i> Cancel Sale
                </button>

                <button
                  className="btn btn-success btn-lg"
                  onClick={handleRegistrarVenta}
                >
                  <i className="bi bi-cash-stack"></i> Pay ($
                  {calcularTotales().total})
                </button>

                <button className="btn btn-primary btn-lg">
                  <i className="bi bi-printer"></i> Invoice & Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
