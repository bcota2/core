import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { PiEraserDuotone } from "react-icons/pi";

function Products() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [estado, setEstado] = useState("Todos"); // valor inicial
  const [categoriaID, setCategoriaID] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/categories/for/products")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => Swal.fire("Error Cargando Categorias", err, "error"));
  }, []);

  useEffect(() => {
    const url = new URL("http://localhost:3001/api/products/filter");
    if (estado && estado !== "Todos") url.searchParams.append("estado", estado);
    if (categoriaID) url.searchParams.append("categoria", categoriaID);
    if (buscar.trim() !== "") url.searchParams.append("buscar", buscar.trim());

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
  }, [estado, categoriaID, buscar]);

  const handleEliminarProducto = (id) => {
    if (!window.confirm("¿Deseas eliminar este producto?")) return;

    fetch(`http://localhost:3001/api/products/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setProductos(productos.filter((prod) => prod.ProductoID !== id));
      })
      .catch((err) => Swal.fire("Error al Eliminar Producto", err, "error"));
  };

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
      <div className=" row mb-3 ">
        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Categoría</label>
          <select
            className="input-text form-control form-select "
            id="cmbCategoryFilter"
            onChange={(e) => setCategoriaID(e.target.value)}
            value={categoriaID}
          >
            <option value="">Seleccionar...</option>
            {categorias.map((cat) => (
              <option key={cat.CategoriaID} value={cat.CategoriaID}>
                {cat.Nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-3 p-2">
          <label style={{ fontSize: 18 }}>Estado</label>
          <select
            className="input-text form-control form-select"
            id="cmbStatusFilter"
            onChange={(e) => setEstado(e.target.value)}
            value={estado}
          >
            <option value="Todos">Todos</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
          </select>
        </div>
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Buscar</label>
          <div className="input-group">
            <input
              className="input-text form-control"
              type="text"
              placeholder="Nombre de Articulo..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary "
              onClick={() => {
                setBuscar("");
                setEstado("Todos");
                setCategoriaID("");
              }}
            >
              <i className="bi bi-eraser"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Listado de Productos */}
      <div className="row mb-3 border-top border-2">
        <div className="col-lg-12 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="bg-light">
                <tr className="text-center">
                  <th width="10%">Código</th>
                  <th width="15%">Nombre</th>
                  <th width="15%">Categoría</th>
                  <th width="15%">Descripcion</th>
                  <th width="10%">Costo</th>
                  <th width="10%">Unidad</th>
                  <th width="10%">Estado</th>
                  <th width="15%">Acciones</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {productos.map((prod) => (
                  <tr key={prod.ProductoID}>
                    <td>{prod.Codigo}</td>
                    <td>{prod.Nombre}</td>
                    <td>{prod.CategoriaNombre}</td>
                    <td>{prod.Descripcion}</td>
                    <td>{prod.PrecioCompra}</td>
                    <td>{prod.Unidad}</td>
                    <td>
                      {" "}
                      {/*Estado*/}
                      <span
                        className={`text-center badge ${
                          prod.Estado === "Activo" ? "bg-success" : "bg-warning"
                        }`}
                      >
                        {prod.Estado}
                      </span>
                    </td>
                    <td className="text-center">
                      {" "}
                      {/*Acciones*/}
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() =>
                          navigate(`/products/edit/${prod.ProductoID}`)
                        }
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminarProducto(prod.ProductoID)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
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

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/categories/for/products")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => Swal.fire("Error Cargando Categorias", err, "error"));

    fetch("http://localhost:3001/api/suppliers")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => Swal.fire("Error Cargando Proveedores", err, "error"));
  }, []);

  const { id } = useParams();
  const isEditing = !!id;
  useEffect(() => {
    if (isEditing) {
      fetch(`http://localhost:3001/api/products`)
        .then((res) => res.json())
        .then((data) => {
          const producto = data.find((c) => c.ProductoID === parseInt(id));
          if (producto) {
            setDataProduct(producto);
          }
        });
    }
  }, [id, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      fetch("http://localhost:3001/api/products/next/code")
        .then((res) => res.json())
        .then((data) => {
          setDataProduct((prev) => ({
            ...prev,
            Codigo: data.codigo,
            CodigoBarras: data.barCode,
          }));
        })
        .catch((err) =>
          Swal.fire("Error al Generar Nuevo Código", err, "error")
        );
    }
  }, [isEditing]);

  const [dataProduct, setDataProduct] = useState({
    Nombre: "",
    Codigo: "",
    CodigoBarras: "",
    Descripcion: "",
    CategoriaID: "",
    Unidad: "PZA",
    PrecioCompra: 0,
    PrecioVenta: 0,
    StockMinimo: 0,
    StockMaximo: 0,
    ProveedorID: "",
    Estado: "Activo",
    NotasInternas: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Mapeo entre IDs y propiedades reales del objeto
    const campo = {
      txtName: "Nombre",
      txtCode: "Codigo",
      txtBarcode: "CodigoBarras",
      txtDescription: "Descripcion",
      cmbCategoriaID: "CategoriaID",
      cmbUnit: "Unidad",
      txtCost: "PrecioCompra",
      txtPrice: "PrecioVenta",
      txtMinStock: "StockMinimo",
      txtMaxStock: "StockMaximo",
      cmbSupplier: "ProveedorID",
      cmbStatus: "Estado",
      txtNotes: "NotasInternas",
    }[id];

    if (!campo) return;

    setDataProduct((prev) => ({
      ...prev,
      [campo]: value,
    }));
  };

  const handleGuardar = () => {
    const url = isEditing
      ? `http://localhost:3001/api/products/${id}`
      : `http://localhost:3001/api/products`;

    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire(
          "Producto Actualizado Exitosamente",
          "Buen Trabajo!",
          "success"
        );
        navigate("/products");
      })
      .catch((err) => Swal.fire("Error al Guardar Producto", err, "success"));
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
                onChange={handleChange}
                value={dataProduct.Nombre}
                placeholder="Nombre completo del producto"
              />
            </div>
            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Código *</label>
              <input
                className="input-text form-control"
                id="txtCode"
                type="text"
                value={dataProduct.Codigo}
                readOnly
              />
            </div>
            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Código de Barras</label>
              <input
                className="input-text form-control"
                id="txtBarcode"
                type="text"
                value={dataProduct.CodigoBarras}
                readOnly
              />
            </div>
            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Categoría *</label>
              <select
                className="form-control input-text form-select"
                id="cmbCategoriaID"
                value={dataProduct.CategoriaID}
                onChange={handleChange}
              >
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
              <select
                className="input-text form-control form-select"
                id="cmbUnit"
                onChange={handleChange}
                value={dataProduct.Unidad}
              >
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
                value={dataProduct.Descripcion}
                onChange={handleChange}
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
                value={dataProduct.PrecioCompra}
                onChange={handleChange}
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
                value={dataProduct.PrecioVenta}
                onChange={handleChange}
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
                value={dataProduct.StockMinimo}
                onChange={handleChange}
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
                value={dataProduct.StockMaximo}
                onChange={handleChange}
              />
            </div>

            <div className="col-lg-6 p-2">
              <label style={{ fontSize: 18 }}>Proveedor Principal</label>
              <select
                className="input-text form-control form-select"
                id="cmbSupplier"
                value={dataProduct.ProveedorID}
                onChange={handleChange}
              >
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
              <select
                className="input-text form-control form-select"
                id="cmbStatus"
                value={dataProduct.Estado}
                onChange={handleChange}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div className="col-lg-12 p-2">
              <label style={{ fontSize: 18 }}>Notas Internas</label>
              <textarea
                className="input-text form-control"
                id="txtNotes"
                rows="2"
                placeholder="Información relevante para el equipo..."
                value={dataProduct.NotasInternas}
                onChange={handleChange}
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
          <button className="btn btn-primary" onClick={handleGuardar}>
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}

export { Products, ProductForm };
