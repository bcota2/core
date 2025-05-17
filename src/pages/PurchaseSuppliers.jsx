import React, { useState } from "react";
import "../styles/inputs.css";
import "../styles/checks.css";
import { estadosMexico } from "../utils/EstadosMex.jsx";

export default function PurchaseSeuppliers() {
  const [productos, setProductos] = useState([
    { Nombre: "", Codigo: "", TiempoEntrega: "" },
  ]);

  const agregarProducto = () => {
    setProductos([...productos, { Nombre: "", Codigo: "", TiempoEntrega: "" }]);
  };

  const actualizarProducto = (index, campo, valor) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][campo] = valor;
    setProductos(nuevosProductos);
  };

  const eliminarProducto = (index) => {
    const nuevos = productos.filter((_, i) => i !== index);
    setProductos(nuevos);
  };

  const obtenerDatosProveedor = () => {
    return {
      Nombre: document.getElementById("txtSupplierName").value,
      RFC: document.getElementById("txtRFC").value,
      Contacto: document.getElementById("txtContact").value,
      Telefono: document.getElementById("txtPhone").value,
      Email: document.getElementById("txtEmail").value,
      SitioWeb: document.getElementById("txtWebsite").value,
      LimiteCredito: parseFloat(
        document.getElementById("txtCreditLimit").value || 0
      ),
      CalleNumero: document.getElementById("txtAddress").value,
      Colonia: document.getElementById("txtNeighborhood").value,
      CP: document.getElementById("txtPostalCode").value,
      Ciudad: document.getElementById("txtCity").value,
      Estado: document.getElementById("cmbState").value,
      Pais: document.getElementById("txtCountry").value,
      Banco: document.getElementById("cmbBank").value,
      CLABE: document.getElementById("txtClabe").value,
      NumCuenta: document.getElementById("txtAccountNumber").value,
      Moneda: document.getElementById("cmbCurrency").value,
      Productos: productos,
    };
  };

  const guardarProveedor = () => {
    const proveedor = obtenerDatosProveedor();

    // Validar campos requeridos
    const camposObligatorios = [
      { campo: proveedor.Nombre, etiqueta: "Nombre/Razón Social" },
      { campo: proveedor.RFC, etiqueta: "RFC" },
      { campo: proveedor.Contacto, etiqueta: "Contacto" },
      { campo: proveedor.Telefono, etiqueta: "Teléfono" },
      { campo: proveedor.Email, etiqueta: "Email" },
      { campo: proveedor.CalleNumero, etiqueta: "Calle y Número" },
      { campo: proveedor.Colonia, etiqueta: "Colonia" },
      { campo: proveedor.CP, etiqueta: "Código Postal" },
      { campo: proveedor.Ciudad, etiqueta: "Ciudad" },
      { campo: proveedor.Estado, etiqueta: "Estado" },
      { campo: proveedor.Pais, etiqueta: "País" },
      { campo: proveedor.Banco, etiqueta: "Banco" },
      { campo: proveedor.CLABE, etiqueta: "CLABE" },
      { campo: proveedor.Moneda, etiqueta: "Moneda" },
    ];
    for (const { campo, etiqueta } of camposObligatorios) {
      if (!campo || campo.trim() === "") {
        alert(`Por favor completa el campo: ${etiqueta}`);
        return; // Detiene la ejecución si hay un campo vacío
      }
    }

    const productosValidos = proveedor.Productos.filter(
      (p) => p.Nombre?.trim() && p.Codigo?.trim() && p.TiempoEntrega?.trim()
    );
    if (productosValidos.length === 0) {
      alert("Debes agregar al menos un producto o servicio con nombre.");
      return;
    }
    fetch("http://localhost:3001/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Proveedor guardado correctamente");
        limpiarFormulario();
        // opcional: limpiar formulario o redirigir
      })
      .catch((err) => console.error("Error al guardar proveedor:", err));
  };

  const limpiarFormulario = () => {
    const limpiar = (id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    };

    [
      "txtSupplierName",
      "txtRFC",
      "txtContact",
      "txtPhone",
      "txtEmail",
      "txtWebsite",
      "txtCreditLimit",
      "txtAddress",
      "txtNeighborhood",
      "txtPostalCode",
      "txtCity",
      "cmbState",
      "txtCountry",
      "cmbBank",
      "txtClabe",
      "txtAccountNumber",
      "cmbCurrency",
    ].forEach(limpiar);

    setProductos([{ Nombre: "", Codigo: "", TiempoEntrega: "" }]); // Limpia productos
  };

  return (
    <>
      <div className="container-fluid">
        {/* Sección de Información Básica */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <h4 className="mb-3">Información del Proveedor</h4>
          </div>

          {/* Nombre del Proveedor */}
          <div className="col-lg-4 p-3">
            <label style={{ fontSize: 18 }}>Nombre/Razón Social *</label>
            <input
              className="input-text form-control"
              id="txtSupplierName"
              type="text"
              placeholder="Ej: Distribuidora MX SA de CV"
            />
          </div>

          {/* RFC */}
          <div className="col-lg-2 p-3">
            <label style={{ fontSize: 18 }}>RFC *</label>
            <input
              className="input-text form-control"
              id="txtRFC"
              type="text"
              placeholder="XAXX010101000"
              maxLength="13"
            />
          </div>

          {/* Contacto Principal */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Contacto Principal *</label>
            <input
              className="input-text form-control"
              id="txtContact"
              type="text"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          {/* Teléfono */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Teléfono *</label>
            <input
              className="input-text form-control"
              id="txtPhone"
              type="tel"
              placeholder="55 1234 5678"
            />
          </div>

          {/* Email */}
          <div className="col-lg-4 p-3">
            <label style={{ fontSize: 18 }}>Email *</label>
            <input
              className="input-text form-control"
              id="txtEmail"
              type="email"
              placeholder="contacto@proveedor.com"
            />
          </div>

          {/* Página Web */}
          <div className="col-lg-4 p-3">
            <label style={{ fontSize: 18 }}>Sitio Web</label>
            <input
              className="input-text form-control"
              id="txtWebsite"
              type="url"
              placeholder="https://www.proveedor.com"
            />
          </div>

          {/* Límite de Crédito */}
          <div className="col-lg-4 p-3">
            <label style={{ fontSize: 18 }}>Límite Crédito (MXN)</label>
            <input
              className="input-text form-control"
              id="txtCreditLimit"
              type="number"
              step="1000"
              min="0"
              placeholder="Ej: 50000"
            />
          </div>
        </div>

        {/* Sección de Dirección */}
        <div className="row mb-4 border-top pt-4">
          <div className="col-lg-12">
            <h4 className="mb-3">Dirección Fiscal</h4>
          </div>

          {/* Calle y Número */}
          <div className="col-lg-6 p-3">
            <label style={{ fontSize: 18 }}>Calle y Número *</label>
            <input
              className="input-text form-control"
              id="txtAddress"
              type="text"
              placeholder="Ej: Av. Reforma #123"
            />
          </div>

          {/* Colonia */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Colonia *</label>
            <input
              className="input-text form-control"
              id="txtNeighborhood"
              type="text"
              placeholder="Ej: Centro"
            />
          </div>

          {/* Código Postal */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>C.P. *</label>
            <input
              className="input-text form-control"
              id="txtPostalCode"
              type="text"
              placeholder="Ej: 06000"
              maxLength="5"
            />
          </div>

          {/* Ciudad */}
          <div className="col-lg-4 p-3">
            <label style={{ fontSize: 18 }}>Ciudad *</label>
            <input
              className="input-text form-control"
              id="txtCity"
              type="text"
              placeholder="Ej: CDMX"
            />
          </div>

          {/* Estado */}
          <div className="col-lg-4 p-3">
            <label style={{ fontSize: 18 }}>Estado *</label>
            <select className="input-text form-control" id="cmbState">
              <option value="">Seleccionar...</option>
              {estadosMexico.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {" "}
                  {estado.label}{" "}
                </option>
              ))}
            </select>
          </div>

          {/* País */}
          <div className="col-lg-4 p-3">
            <label style={{ fontSize: 18 }}>País *</label>
            <input
              className="input-text form-control"
              id="txtCountry"
              type="text"
              value="México"
              readOnly
            />
          </div>
        </div>

        {/* Sección Bancaria */}
        <div className="row mb-4 border-top pt-4">
          <div className="col-lg-12">
            <h4 className="mb-3">Datos Bancarios</h4>
          </div>

          {/* Banco */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Banco *</label>
            <select className="input-text form-control" id="cmbBank">
              <option value="">Seleccionar...</option>
              <option value="BBVA">BBVA</option>
              <option value="Santander">Santander</option>
              <option value="Banamex">Banamex</option>
            </select>
          </div>

          {/* CLABE */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>CLABE *</label>
            <input
              className="input-text form-control"
              id="txtClabe"
              type="text"
              placeholder="18 dígitos"
              maxLength="18"
            />
          </div>

          {/* Cuenta Bancaria */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Número de Cuenta</label>
            <input
              className="input-text form-control"
              id="txtAccountNumber"
              type="text"
              placeholder="10-16 dígitos"
              maxLength="16"
            />
          </div>

          {/* Moneda */}
          <div className="col-lg-3 p-3">
            <label style={{ fontSize: 18 }}>Moneda</label>
            <select className="input-text form-control" id="cmbCurrency">
              <option value="MXN" selected>
                MXN - Peso Mexicano
              </option>
              <option value="USD">USD - Dólar Americano</option>
            </select>
          </div>
        </div>

        {/* Sección de Productos */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <h4 className="mb-3">Productos/Servicios que Provee</h4>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th style={{ width: "50%" }}>Producto/Servicio</th>
                    <th>Código</th>
                    <th>Tiempo Entrega</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          className="input-text form-control"
                          type="text"
                          value={prod.Nombre}
                          onChange={(e) =>
                            actualizarProducto(index, "Nombre", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="input-text form-control"
                          type="text"
                          value={prod.Codigo}
                          onChange={(e) =>
                            actualizarProducto(index, "Codigo", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="input-text form-control"
                          value={prod.TiempoEntrega}
                          onChange={(e) =>
                            actualizarProducto(
                              index,
                              "TiempoEntrega",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Seleccionar...</option>
                          <option value="1 Día">1 Día</option>
                          <option value="3 Días">3 Días</option>
                          <option value="1 Semana">1 Semana</option>
                          <option value="2 Semanas">2 Semanas</option>
                          <option value="1 Mes">1 Mes</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarProducto(index)}
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
              className="btn btn-secondary mt-2"
              onClick={agregarProducto}
            >
              + Agregar Producto
            </button>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="row mb-4">
          <div className="col-lg-12 d-flex justify-content-end">
            <button
              className="btn btn-outline-secondary me-2"
              style={{ padding: "8px 20px", fontSize: 16 }}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              style={{ padding: "8px 20px", fontSize: 16 }}
              onClick={guardarProveedor}
            >
              Guardar Proveedor
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
