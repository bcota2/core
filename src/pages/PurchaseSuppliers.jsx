import "../styles/inputs.css";
import "../styles/checks.css";

export default function PurchaseSeuppliers() {
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

          {/* Días de Crédito */}
          <div className="col-lg-2 p-3">
            <label style={{ fontSize: 18 }}>Días Crédito</label>
            <select className="input-text form-control" id="cmbCreditDays">
              <option value="0">Contado</option>
              <option value="15">15 días</option>
              <option value="30" selected>
                30 días
              </option>
              <option value="60">60 días</option>
            </select>
          </div>

          {/* Límite de Crédito */}
          <div className="col-lg-2 p-3">
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
        <div className="row mb-4">
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
              <option value="CDMX">Ciudad de México</option>
              <option value="JAL">Jalisco</option>
              {/* Agregar todos los estados */}
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
        <div className="row mb-4">
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
                  <tr>
                    <td>
                      <input className="input-text form-control" type="text" />
                    </td>
                    <td>
                      <input className="input-text form-control" type="text" />
                    </td>
                    <td>
                      <input
                        className="input-text form-control"
                        type="text"
                        placeholder="Ej: 3 días"
                      />
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm">×</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="btn btn-secondary mt-2">
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
            >
              Guardar Proveedor
            </button>
          </div>
        </div>
      </div>

    </>
  );
}
