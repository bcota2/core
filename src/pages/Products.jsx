import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Products() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="row mb-4 bg-light p-3">
        <div className="col-lg-8">
          <h4 className="m-0">GESTIÓN DE PRODUCTOS</h4>
        </div>
        <div className="col-lg-4 text-end">
          <button
            className="btn btn-success"
            onClick={() => navigate("/products/new")}
          >
            <i className="bi bi-plus-circle"></i> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Categoría</label>
          <select className="input-text form-control" id="cmbCategoryFilter">
            <option value="">Todas</option>
            <option value="electronics">Electrónicos</option>
            <option value="parts">Refacciones</option>
          </select>
        </div>
        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Estado</label>
          <select className="input-text form-control" id="cmbStatusFilter">
            <option value="">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Buscar</label>
          <div className="input-group">
            <input
              className="input-text form-control"
              type="text"
              placeholder="Código, nombre o descripción..."
            />
            <button className="btn btn-outline-secondary">
              <i className="bi bi-search"></i>
            </button>
          </div>
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
                  <th width="20%">Nombre</th>
                  <th width="15%">Categoría</th>
                  <th width="10%">Precio</th>
                  <th width="10%">Stock</th>
                  <th width="10%">Unidad</th>
                  <th width="10%">Estado</th>
                  <th width="15%">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PROD-001</td>
                  <td>Laptop HP Pavilion</td>
                  <td>Electrónicos</td>
                  <td>$15,999.00</td>
                  <td className="text-success fw-bold">25</td>
                  <td>PZA</td>
                  <td>
                    <span className="badge bg-success">Activo</span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => navigate("/products/edit/PROD-001")}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación */}
      <div className="row">
        <div className="col-lg-12 d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              <li className="page-item disabled">
                <button className="page-link">Anterior</button>
              </li>
              <li className="page-item active">
                <button className="page-link">1</button>
              </li>
              <li className="page-item">
                <button className="page-link">2</button>
              </li>
              <li className="page-item">
                <button className="page-link">3</button>
              </li>
              <li className="page-item">
                <button className="page-link">Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

function ProductForm() {
  const navigate = useNavigate();
  const isEditing = true;
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/categories")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));

    fetch("http://localhost:3001/api/suppliers")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => console.error("Error cargando proveedores:", err));
  }, []);

  const obtenerDatosProductos = () => {
    return {
      Nombre: document.getElementById("txtNombre").value,
      CategoriaID: document.getElementById("cmbCategoriaID").value,
      Unidad: document.getElementById("cmbUnit").value,
      PrecioCompra: document.getElementById("txtCost").value,
      PrecioVenta: document.getElementById("txtPrice").value,
      StockMinimo: document.getElementById("txtMinStock").value,
      StockMaximo: document.getElementById("txtMaxStock").value,
      Proveedor: document.getElementById("cmbSupplier").value,
      Estado: document.getElementById("cmbStatus").value,
      Descripcion: document.getElementById("txtDescription").value,
      Notas: document.getElementById("txtNotes").value,
    };
  };

  const guardarProducto = () => {
    const producto = obtenerDatosProductos();

    const camposObligatorios = [
      { campo: producto.Nombre, etiqueta: "Nombre" },
      { campo: producto.CategoriaID, etiqueta: "CategoríaID" },
      { campo: producto.Unidad, etiqueta: "Unidad" },
      { campo: producto.PrecioCompra, etiqueta: "Precio de Compra" },
      { campo: producto.PrecioVenta, etiqueta: "Precio de Venta" },
      { campo: producto.StockMinimo, etiqueta: "Stock Mínimo" },
      { campo: producto.StockMaximo, etiqueta: "Stock Máximo" },
      { campo: producto.Estado, etiqueta: "Estado" },
    ];

    for (const { campo, etiqueta } of camposObligatorios) {
      if (!campo || campo.toString().trim() === "") {
        alert(`Por favor completa el campo: ${etiqueta}`);
        return;
      }
    }

    fetch("http://localhost:3001/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        limpiarFormulario(); // opcional
      })
      .catch((err) => console.error("Error al guardar producto:", err));
  };
  const limpiarFormulario = () => {
    const limpiar = (id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    };

    [
      "txtNombre",
      "cmbCategoria",
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
  };

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="row mb-4 bg-light p-3">
        <div className="col-lg-8">
          <h4 className="m-0">
            {isEditing ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}
          </h4>
        </div>
        <div className="col-lg-4 text-end">
          <span style={{ fontSize: 18 }}>
            <strong>Código:</strong> {isEditing ? "PROD-001" : "Nuevo"}
          </span>
        </div>
      </div>

      {/* Formulario */}
      <div className="row mb-3">
        {/* Columna Izquierda */}
        <div className="col-lg-6">
          <div className="row">
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
            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Categoría *</label>
              <select className="form-control input-text" id="cmbCategoriaID">
                <option value="">Seleccionar...</option>
                {categorias.map((cat) => (
                  <option key={cat.CategoriaID} value={cat.CategoriaID}>
                    {cat.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Unidad *</label>
              <select className="input-text form-control" id="cmbUnit">
                <option value="PZA">Pieza (PZA)</option>
                <option value="KG">Kilogramo (KG)</option>
                <option value="L">Litro (L)</option>
              </select>
            </div>
            <div className="col-lg-12 p-2">
              <label style={{ fontSize: 18 }}>Descripción</label>
              <textarea
                className="input-text form-control"
                id="txtDescription"
                rows="3"
                placeholder="Descripción detallada del producto..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="col-lg-6">
          <div className="row">
            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Precio de Compra *</label>
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
            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Stock Mínimo *</label>
              <input
                className="input-text form-control"
                id="txtMinStock"
                type="number"
                min="0"
                defaultValue="10"
              />
            </div>
            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Stock Máximo</label>
              <input
                className="input-text form-control"
                id="txtMaxStock"
                type="number"
                min="0"
                defaultValue="100"
              />
            </div>

            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Proveedor Principal</label>
              <select className="input-text form-control" id="cmbSupplier">
                <option value="">Seleccionar...</option>
                {proveedores.map((cat) => (
                  <option key={cat.ProveedorID} value={cat.ProveedorID}>
                    {cat.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Estado *</label>
              <select className="input-text form-control" id="cmbStatus">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="col-lg-12 p-2">
              <label style={{ fontSize: 18 }}>Notas Internas</label>
              <textarea
                className="input-text form-control"
                id="txtNotes"
                rows="2"
                placeholder="Información relevante para el equipo..."
              ></textarea>
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
            onClick={() => navigate("/products")}
          >
            <i className="bi bi-x-circle"></i> Cancelar
          </button>
          <button className="btn btn-primary" onClick={guardarProducto}>
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}

export { Products, ProductForm };
