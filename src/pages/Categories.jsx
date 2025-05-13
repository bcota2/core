import { useNavigate } from 'react-router-dom';

function Categories() {
  const navigate = useNavigate();

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
            onClick={() => navigate('/categories/new')}
          >
            <i className="bi bi-plus-circle"></i> Nueva Categoría
          </button>
        </div>
      </div>

      {/* Filtros Rápidos */}
      <div className="row mb-3">
        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Buscar</label>
          <input
            className="input-text form-control"
            type="text"
            placeholder="Nombre o código de categoría..."
          />
        </div>
        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Estado</label>
          <select className="input-text form-control" id="cmbStatus">
            <option value="">Todas</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        </div>
        <div className="col-lg-4 p-2 d-flex align-items-end">
          <button className="btn btn-primary w-100">
            <i className="bi bi-funnel"></i> Filtrar
          </button>
        </div>
      </div>

      {/* Listado de Categorías */}
      <div className="row mb-3">
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="bg-light">
                <tr>
                  <th width="15%">Código</th>
                  <th width="25%">Nombre</th>
                  <th width="20%">Categoría Padre</th>
                  <th width="15%">Productos</th>
                  <th width="15%">Estado</th>
                  <th width="10%">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CAT-ELEC</td>
                  <td>Electrónicos</td>
                  <td>-</td>
                  <td>42</td>
                  <td><span className="badge bg-success">Activa</span></td>
                  <td className="text-center">
                    <button 
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => navigate('/categories/edit/CAT-ELEC')}
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
                <a className="page-link" href="#">Anterior</a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">1</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">2</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">Siguiente</a>
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
  const isEditing = true; // Cambiar según corresponda

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="row mb-4 bg-light p-3">
        <div className="col-lg-8">
          <h4 className="m-0">{isEditing ? 'EDITAR CATEGORÍA' : 'NUEVA CATEGORÍA'}</h4>
        </div>
        <div className="col-lg-4 text-end">
          <span style={{ fontSize: 18 }}>
            <strong>Código:</strong> {isEditing ? 'CAT-ELEC' : 'Auto-generado'}
          </span>
        </div>
      </div>

      {/* Formulario */}
      <div className="row mb-3">
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Nombre *</label>
          <input
            className="input-text form-control"
            id="txtName"
            type="text"
            placeholder="Ej: Electrónicos"
          />
        </div>
        <div className="col-lg-6 p-2">
          <label style={{ fontSize: 18 }}>Categoría Padre</label>
          <select className="input-text form-control" id="cmbParentCategory">
            <option value="">Ninguna (categoría raíz)</option>
            <option value="1">Tecnología</option>
          </select>
        </div>
        <div className="col-lg-12 p-2">
          <label style={{ fontSize: 18 }}>Descripción</label>
          <textarea
            className="input-text form-control"
            id="txtDescription"
            rows="3"
            placeholder="Descripción de la categoría..."
          ></textarea>
        </div>
        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Estado *</label>
          <select className="input-text form-control" id="cmbStatus">
            <option value="active">Activa</option>
            <option value="inactive">Inactiva</option>
          </select>
        </div>
        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Impuesto (%) *</label>
          <input
            className="input-text form-control"
            id="txtTax"
            type="number"
            step="0.01"
            min="0"
            defaultValue="16.00"
          />
        </div>
        <div className="col-lg-4 p-2">
          <label style={{ fontSize: 18 }}>Código SAT *</label>
          <input
            className="input-text form-control"
            id="txtSatCode"
            type="text"
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
            onClick={() => navigate('/categories')}
          >
            <i className="bi bi-x-circle"></i> Cancelar
          </button>
          <button
            className="btn btn-primary"
            style={{ padding: "8px 20px", fontSize: 16 }}
          >
            <i className="bi bi-check-circle"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export { Categories, CategoryForm };