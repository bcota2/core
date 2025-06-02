import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Quotes() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [quoteItems, setQuoteItems] = useState([]);
  const [quoteNumber, setQuoteNumber] = useState("");
  const [quoteDate, setQuoteDate] = useState("");
  const [clienteID, setClienteID] = useState("");
  const [validezDias, setValidezDias] = useState(15);
  const [moneda, setMoneda] = useState("MXN");
  const [condiciones, setCondiciones] = useState("");
  const [notasInternas, setNotasInternas] = useState("");
  const [descuentoGlobal, setDescuentoGlobal] = useState(0);
  const [quoteID, setQuoteID] = useState(null); 


  useEffect(() => {
    fetch("http://localhost:3001/api/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));

    fetch("http://localhost:3001/api/products/filter")
      .then((res) => res.json())
      .then((data) => setProductos(data));

    fetch("http://localhost:3001/api/quotes/next-number")
      .then((res) => res.json())
      .then((data) => {
        setQuoteNumber(data.nextQuoteNumber);
        setQuoteDate(new Date().toISOString().split("T")[0]);
      });
    fetch("http://localhost:3001/api/customers")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch(() =>
        Swal.fire("Error", "No se pudieron cargar los clientes", "error")
      );
  }, []);

  const handleAddItem = () => {
    setQuoteItems([
      ...quoteItems,
      {
        productoID: "",
        descripcion: "",
        unidad: "PZA",
        precioUnitario: 0,
        cantidad: 1,
        descuentoUnitario: 0,
        total: 0,
      },
    ]);
  };

  const handleItemChange = (index, campo, valor) => {
    const items = [...quoteItems];
    items[index][campo] = valor;

    // Si selecciona un producto, buscar datos adicionales
    if (campo === "productoID") {
      const producto = productos.find((p) => p.ProductoID == valor);
      if (producto) {
        items[index].unidad = producto.Unidad || "PZA";
        items[index].precioUnitario = parseFloat(producto.PrecioVenta) || 0;
      }
    }

    // Recalcular total
    const cantidad = parseFloat(items[index].cantidad) || 0;
    const precio = parseFloat(items[index].precioUnitario) || 0;
    const desc = parseFloat(items[index].descuentoUnitario) || 0;
    items[index].total = (precio - desc) * cantidad;

    setQuoteItems(items);
  };

  const handleRemoveItem = (index) => {
    const items = [...quoteItems];
    items.splice(index, 1);
    setQuoteItems(items);
  };

  const calcularTotales = () => {
    let subtotal = 0;

    quoteItems.forEach((item) => {
      subtotal += parseFloat(item.total) || 0;
    });

    const descGlobal = parseFloat(descuentoGlobal) || 0;
    const iva = (subtotal - descGlobal) * 0.16;
    const total = subtotal - descGlobal + iva;

    return {
      subtotal: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      total: total.toFixed(2),
    };
  };

const handleSaveQuote = async (estado = "Draft") => {
  if (!quoteDate || !clienteID || quoteItems.length === 0) {
    Swal.fire("Faltan datos", "Llena los campos requeridos", "warning");
    return;
  }

  const body = {
    quoteNumber,
    quoteDate,
    clienteID,
    moneda,
    validezDias,
    condiciones,
    notasInternas,
    descuentoGlobal,
    vendedorID: null,
    items: quoteItems,
    status: estado
  };

  try {
    let res;

    // Si es una edición de draft → actualiza
    if (quoteID) {
      res = await fetch(`http://localhost:3001/api/quotes/${quoteID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    } else {
      // Nuevo
      res = await fetch("http://localhost:3001/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    }

    if (res.ok) {
      Swal.fire("Éxito", "Cotización guardada", "success");
       resetForm(); 
    } else {
      Swal.fire("Error", "No se pudo guardar la cotización", "error");
    }
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
};


  const { subtotal, iva, total } = calcularTotales();

  const [showModal, setShowModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    Nombre: "",
    RFC: "",
    Telefono: "",
    Correo: "",
    Direccion: "",
  });

  const guardarCliente = async () => {
    if (!nuevoCliente.Nombre) {
      Swal.fire(
        "Campo requerido",
        "El nombre del cliente es obligatorio.",
        "warning"
      );
      return;
    }

    const res = await fetch("http://localhost:3001/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCliente),
    });

    if (res.ok) {
      const nuevo = await res.json();
      setShowModal(false);
      setNuevoCliente({
        Nombre: "",
        RFC: "",
        Telefono: "",
        Correo: "",
        Direccion: "",
      });

      // Recargar clientes y seleccionar el nuevo
      fetch("http://localhost:3001/api/customers")
        .then((res) => res.json())
        .then((data) => {
          setClientes(data);
          setClienteID(nuevo.ClienteID); // Asigna el nuevo automáticamente
        });

      Swal.fire("Éxito", "Cliente agregado correctamente", "success");
    } else {
      Swal.fire("Error", "No se pudo agregar el cliente", "error");
    }
  };

  useEffect(() => {
    if (!showModal) {
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    }
  }, [showModal]);


const [folioBuscar, setFolioBuscar] = useState("");

const buscarDraft = async () => {
  if (!folioBuscar) return;

  const res = await fetch(`http://localhost:3001/api/quotes/by-folio/${folioBuscar}`);
  if (!res.ok) {
    Swal.fire("No encontrado", "No se encontró una cotización con ese folio", "warning");
    return;
  }

  const data = await res.json();
  const q = data.quote;

  if (q.Estado !== "Draft") {
    Swal.fire("Error", "Solo puedes cargar cotizaciones en estado Draft", "error");
    return;
  }

  // Asignar campos
  setQuoteID(q.QuoteID);
  setQuoteNumber(q.QuoteNumber);
  setQuoteDate(q.QuoteDate);
  setClienteID(q.ClienteID);
  setMoneda(q.Moneda);
  setValidezDias(q.ValidezDias);
  setCondiciones(q.Condiciones || "");
  setNotasInternas(q.NotasInternas || "");
  setDescuentoGlobal(q.DescuentoGlobal || 0);
  setQuoteItems(data.items.map((item) => ({
    productoID: item.ProductoID,
    unidad: item.Unidad,
    precioUnitario: item.PrecioUnitario,
    cantidad: item.Cantidad,
    descuentoUnitario: item.DescuentoUnitario,
    total: item.Total
  })));

  Swal.fire("Éxito", "Cotización cargada", "success");
};

{/* Limpiar Campos */}
const resetForm = async () => {
  // Regenerar número de cotización
  const res = await fetch("http://localhost:3001/api/quotes/next-number");
  const data = await res.json();
  setQuoteNumber(data.nextQuoteNumber);

  setQuoteDate(new Date().toISOString().split("T")[0]);
  setClienteID("");
  setValidezDias(15);
  setMoneda("MXN");
  setCondiciones("");
  setNotasInternas("");
  setDescuentoGlobal(0);
  setQuoteItems([]);
  setQuoteID(null); // Si usas un ID de backend, también límpialo
  setFolioBuscar(""); // Limpiar campo de búsqueda
};



  return (
    <div className="container-fluid">
      <div className="row mb-4 bg-light p-3">
        <div className="col-lg-6">
          <h4 className="m-0">NEW QUOTE</h4>
        </div>
        <div className="col-lg-6 text-end">
          <span className="me-3" style={{ fontSize: 18 }}>
            <strong>Folio:</strong> {quoteNumber}
          </span>
          <span style={{ fontSize: 18 }}>
            <strong>Fecha:</strong> {quoteDate}
          </span>
        </div>
      </div>

      <div className="row mb-3 ">
        <div className="col-lg-4 ">
          <label style={{ fontSize: 16 }}>Load from Draft</label>
          <div className="input-group">
            <input
              className="form-control"
              placeholder="QT-2025-0001"
              value={folioBuscar}
              onChange={(e) => setFolioBuscar(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarDraft()}
            />
            <button className="btn btn-outline-primary" onClick={buscarDraft}>
              Load
            </button>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        {/* Cliente */}
        <div className="col-lg-5 p-2">
          <label style={{ fontSize: 18 }}>Customer *</label>
          <div className="input-group">
            <select
              className="form-select text-center"
              value={clienteID}
              onChange={(e) => setClienteID(e.target.value)}
            >
              <option value="">Select Customer...</option>
              {clientes.map((c) => (
                <option key={c.ClienteID} value={c.ClienteID}>
                  {c.Nombre}
                </option>
              ))}
            </select>
            <button
              className="btn btn-outline-secondary text-center  "
              type="button"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus"></i> New
            </button>
          </div>
        </div>

        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Validation Days *</label>
          <select
            className="form-select text-center"
            value={validezDias}
            onChange={(e) => setValidezDias(e.target.value)}
          >
            <option value="7">7 Days</option>
            <option value="15">15 Days</option>
            <option value="30">30 Days</option>
          </select>
        </div>

        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Currency *</label>
          <select
            className="form-select text-center"
            value={moneda}
            onChange={(e) => setMoneda(e.target.value)}
          >
            <option value="MXN">MXN - Mexican Pesos</option>
            <option value="USD">USD - American Dollar</option>
          </select>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-12">
          <h4 className="mb-3">Products Listed</h4>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="text-center">
                <tr>
                  <th style={{ width: "40%" }}>Product</th>
                  <th width="12%">Unity</th>
                  <th width="8%">Quantity</th>
                  <th>Unit Price</th>
                  <th width="10%">Disccount</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {quoteItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        className="form-select"
                        value={item.productoID}
                        onChange={(e) =>
                          handleItemChange(index, "productoID", e.target.value)
                        }
                      >
                        <option value="">Select Product...</option>
                        {productos.map((prod) => (
                          <option key={prod.ProductoID} value={prod.ProductoID}>
                            {prod.Nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="form-control text-center"
                        value={item.unidad}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control text-center"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleItemChange(index, "cantidad", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control text-center"
                        type="number"
                        value={item.precioUnitario}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control text-center"
                        min="0"
                        value={item.descuentoUnitario}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "descuentoUnitario",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control text-center"
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
          <button className="btn btn-success mt-2" onClick={handleAddItem}>
            <i className="bi bi-plus-circle"></i> Add Product
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="p-2">
            <label style={{ fontSize: 18 }}> Business Conditions </label>
            <textarea
              className="form-control"
              rows="3"
              value={condiciones}
              onChange={(e) => setCondiciones(e.target.value)}
            />
          </div>
          <div className="p-2">
            <label style={{ fontSize: 18 }}> Internal Notes </label>
            <textarea
              className="form-control"
              rows="2"
              value={notasInternas}
              onChange={(e) => setNotasInternas(e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="p-2 border bg-light">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span> Overall Discount:</span>
              <input
                type="number"
                className="form-control text-end"
                style={{ width: "100px" }}
                value={descuentoGlobal}
                onChange={(e) => setDescuentoGlobal(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>IVA (16%):</span>
              <span>${iva}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <strong>Total:</strong>
              <strong>${total}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-12 d-flex justify-content-end">
          <button
            className="btn btn-secondary me-2"
            onClick={() => handleSaveQuote("Draft")}
          >
            <i className="bi bi-file-earmark"></i> Save Draft
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => handleSaveQuote("Finalizada")}
          >
            <i className="bi bi-check-circle"></i> Save Quote
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Cliente</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {["Nombre", "RFC", "Telefono", "Correo", "Direccion"].map(
                    (campo) => (
                      <div key={campo} className="col-md-6 mb-3">
                        <label>{campo}</label>
                        <input
                          className="form-control"
                          value={nuevoCliente[campo]}
                          onChange={(e) =>
                            setNuevoCliente({
                              ...nuevoCliente,
                              [campo]: e.target.value,
                            })
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={guardarCliente}>
                  Guardar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
