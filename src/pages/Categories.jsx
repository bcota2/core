import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import Swal from "sweetalert2";

function Categories() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [estado, setEstado] = useState("Todas");

  useEffect(() => {
    const url = new URL("http://localhost:3001/api/categories/filter");
    if (estado && estado !== "Todos") url.searchParams.append("estado", estado);
    if (buscar.trim() !== "") url.searchParams.append("buscar", buscar.trim());

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setCategorias([]);
          console.error("Respuesta no válida:", data);
        } else {
          setCategorias(data);
        }
      })
      .catch((err) => Swal.fire("Error Cargando Categorias", err, "error"));
  }, [estado, buscar]);

  const handleEliminarCategoria = (id) => {
    if (!window.confirm("¿Deseas eliminar esta categoría?")) return;

    fetch(`http://localhost:3001/api/categories/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setCategorias(categorias.filter((cat) => cat.CategoriaID !== id));
      })
      .catch((err) => Swal.fire("Error al Eliminar", err, "error"));
  };

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="row mb-4 bg-light p-3">
        <div className="col-lg-8">
          <h4 className="m-0">GESTIÓN DE CATEGORÍAS</h4>
        </div>
        <div className="col-lg-4 text-end">
          <button
            className="btn btn-success"
            onClick={() => navigate("/categories/new")}
          >
            <i className="bi bi-plus-circle"></i> Nueva Categoría
          </button>
        </div>
      </div>

      {/* Filtros Rápidos */}
      <div className="row mb-3">
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Buscar</label>
          <input
            className="input-text form-control "
            type="text"
            placeholder="Nombre o Código de categoría..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </div>
        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Estado</label>
          <select
            className="input-text form-control form-select"
            id="cmbStatus"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="Todas">Todas</option>
            <option value="Activa">Activas</option>
            <option value="Inactiva">Inactivas</option>
          </select>
        </div>
      </div>

      {/* Listado de Categorías */}
      <div className="row mb-3">
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="bg-light text-center">
                <tr>
                  <th width="15%">Código</th>
                  <th width="25%">Nombre</th>
                  <th width="20%">Categoría Padre</th>
                  <th width="15%">Productos</th>
                  <th width="15%">Estado</th>
                  <th width="10%">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {categorias.map((cat) => (
                  <tr key={cat.CategoriaID}>
                    <td>{cat.Codigo}</td>
                    <td>{cat.Nombre}</td>
                    <td>{cat.CategoriaPadre || "-"}</td>
                    <td>-</td>
                    {/* Aquí podrías poner el número de productos si lo tienes */}
                    <td>
                      <span
                        className={`badge ${
                          cat.Estado === "Activa" ? "bg-success" : "bg-warning"
                        }`}
                      >
                        {cat.Estado}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() =>
                          navigate(`/categories/edit/${cat.CategoriaID}`)
                        }
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminarCategoria(cat.CategoriaID)}
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
                <button className="page-link">Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Detecta si hay ID (modo edición)
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    Codigo: "",
    Nombre: "",
    CategoriaPadre: "",
    Descripcion: "",
    Estado: "Activa",
    Impuesto: 16.0,
    CodigoSAT: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetch(`http://localhost:3001/api/categories`)
        .then((res) => res.json())
        .then((data) => {
          const categoria = data.find((c) => c.CategoriaID === parseInt(id));
          if (categoria) {
            setFormData(categoria);
          }
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("txt", "").replace("cmb", "")]: value,
    }));
  };
  const handleGuardar = () => {
    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing
      ? `http://localhost:3001/api/categories/${id}`
      : "http://localhost:3001/api/categories";

    const data = {
      ...formData,
      CategoriaPadre: formData.CategoriaPadre
        ? parseInt(formData.CategoriaPadre)
        : null,
    };

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Categoría guardada correctamente");
        navigate("/categories");
      })
      .catch((err) => console.error("Error al guardar:", err));
  };

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="row mb-4 bg-light p-3">
        <div className="col-lg-8">
          <h4 className="m-0">
            {isEditing ? "EDITAR CATEGORÍA" : "NUEVA CATEGORÍA"}
          </h4>
        </div>
        <div className="col-lg-4 text-end">
          <span style={{ fontSize: 18 }}>
            <strong>Código:</strong> {isEditing ? "CAT-ELEC" : "Auto-generado"}
          </span>
        </div>
      </div>

      {/* Formulario */}
      <div className="row mb-3">
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Nombre *</label>
          <input
            className="form-control"
            id="txtNombre"
            type="text"
            value={formData.Nombre}
            onChange={handleChange}
            placeholder="Ej: Electrónicos"
          />
        </div>

        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Categoría Padre</label>
          <select
            className="form-control"
            id="cmbCategoriaPadre"
            value={formData.CategoriaPadre || ""}
            onChange={handleChange}
          >
            <option value="">Ninguna (categoría raíz)</option>
            <option value="1">Tecnología</option>
          </select>
        </div>

        <div className="col-lg-12 p-2">
          <label style={{ fontSize: 18 }}>Descripción</label>
          <textarea
            className="form-control"
            id="txtDescripcion"
            rows="3"
            value={formData.Descripcion}
            onChange={handleChange}
            placeholder="Descripción de la categoría..."
          ></textarea>
        </div>

        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Estado *</label>
          <select
            className="form-control"
            id="cmbEstado"
            value={formData.Estado}
            onChange={handleChange}
          >
            <option value="Activa">Activa</option>
            <option value="Inactiva">Inactiva</option>
          </select>
        </div>

        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Impuesto (%) *</label>
          <input
            className="form-control"
            id="txtImpuesto"
            type="number"
            step="0.01"
            min="0"
            value={formData.Impuesto}
            onChange={handleChange}
          />
        </div>

        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Código SAT *</label>
          <input
            className="form-control"
            id="txtCodigoSAT"
            type="text"
            value={formData.CodigoSAT}
            onChange={handleChange}
            placeholder="Ej: 85171800"
          />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="row">
        <div className="col-lg-12 d-flex justify-content-end">
          <button
            className="btn btn-outline-secondary me-2"
            style={{ padding: "8px 20px", fontSize: 16 }}
            onClick={() => navigate("/categories")}
          >
            <i className="bi bi-x-circle"></i> Cancelar
          </button>
          <button
            className="btn btn-primary"
            style={{ padding: "8px 20px", fontSize: 16 }}
            onClick={handleGuardar}
          >
            <i className="bi bi-check-circle"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export { Categories, CategoryForm };
