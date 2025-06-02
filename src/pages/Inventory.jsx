import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Inventory() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estado, setEstado] = useState("Todos"); // valor inicial
  const [categoriaID, setCategoriaID] = useState("");
  const [buscar, setBuscar] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/categories/for/products")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) =>
        Swal.fire("Error Cargando Categorías", err.message, "error")
      );
  }, []);

  useEffect(() => {
    const url = new URL("http://localhost:3001/api/products/filter");
    if (estado && estado !== "Todos") url.searchParams.append("estado", estado);
    if (categoriaID) url.searchParams.append("categoria", categoriaID);
    if (buscar.trim() !== "") url.searchParams.append("buscar", buscar.trim());

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let resultado = [...data];

        // Aplicar filtro de estado de stock si está seleccionado
        if (stockStatusFilter === "low") {
          resultado = resultado.filter(
            (p) => p.Stock < p.StockMinimo && p.Stock > 0
          );
        } else if (stockStatusFilter === "out") {
          resultado = resultado.filter((p) => p.Stock === 0);
        } else if (stockStatusFilter === "over") {
          resultado = resultado.filter((p) => p.Stock > p.StockMaximo);
        }

        setProductos(data);
        setProductosFiltrados(resultado);
      })
      .catch((err) => Swal.fire("Error Cargando Productos", err, "error"));
  }, [estado, categoriaID, buscar, stockStatusFilter]);

useEffect(() => {
  const url = new URL("http://localhost:3001/api/products/filter");
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setProductos(data);
      setProductosFiltrados(data); // mostrar todos inicialmente
    });
}, []);


  return (
    <>
      <div className="container-fluid">
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
                placeholder="Nombre de Articulo..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
              />{" "}
              <button className="btn btn-outline-secondary" type="button" disabled>
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="row mb-3">
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
            <label style={{ fontSize: 18 }}>Estado Stock</label>
            <select
              className="input-text form-control"
              id="cmbStockStatus"
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="low">Bajo inventario</option>
              <option value="out">Agotados</option>
              <option value="over">Exceso</option>
            </select>
          </div>
          <div className="col-lg-3 p-2 d-flex align-items-end ">
            <button className="btn btn-primary w-100">
              <i className="bi bi-funnel"></i> Filtrar
            </button>
          </div>
        </div>

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
                  {productosFiltrados.map((prod) => (
                    <tr key={prod.ProductoID}>
                      <td>{prod.Codigo}</td>
                      <td>{prod.Nombre}</td>
                      <td>{prod.CategoriaNombre}</td>
                      <td
                        className={
                          prod.Stock < prod.StockMinimo
                            ? "text-danger fw-bold"
                            : prod.Stock > prod.StockMaximo
                            ? "text-warning fw-bold"
                            : ""
                        }
                      >
                        {prod.Stock}
                      </td>
                      <td>{prod.StockMinimo}</td>
                      <td>{prod.StockMaximo}</td>
                      <td>{prod.Ubicacion}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-box-arrow-in-down"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
                  {" "}
                  <i className="bi bi-box-seam"></i> Ajuste de Inventario{" "}
                </button>
                <button
                  className="btn btn-info me-2"
                  onClick={() => navigate("/inventory/transfer")}
                >
                  {" "}
                  <i className="bi bi-arrow-left-right"></i> Transferencia{" "}
                </button>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => navigate("/reports")}
                >
                  {" "}
                  <i className="bi bi-file-earmark-bar-graph"></i> Reporte{" "}
                </button>
                <button className="btn btn-dark">
                  {" "}
                  <i className="bi bi-upc-scan"></i> Etiquetas{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
