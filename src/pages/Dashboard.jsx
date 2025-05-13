import { useNavigate } from 'react-router-dom';
import { BarChart, PieChart } from './Charts.jsx'; // Componentes personalizados

function Dashboard() {
  const navigate = useNavigate();

  // Datos de ejemplo (en producción vendrían de una API)
  const stats = {
    sales: { current: 125000, lastMonth: 98000 },
    purchases: { current: 85000, lastMonth: 92000 },
    inventory: { totalItems: 1245, lowStock: 23 },
    topProducts: [
      { name: "Laptop HP", value: 42 },
      { name: "Keyboard", value: 35 },
      { name: "OLED Monitor 24\"", value: 28 }
    ]
  };

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="row mb-4 bg-light p-3 rounded">
        <div className="col-lg-8">
          <h1 className="m-0 text-primary">CORE</h1>
          <p className="m-0 text-muted">Centralized Operations Resource Engine</p>
        </div>
        <div className="col-lg-4 text-end">
          <span style={{ fontSize: 18 }}>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Tarjetas Resumen */}
      <div className="row mb-4">
        {/* Ventas */}
        <div className="col-lg-4 p-2">
          <div className="border p-3 rounded bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="text-muted">SALES</h5>
                <h2 className="text-success">${stats.sales.current.toLocaleString()}</h2>
                <span className={stats.sales.current > stats.sales.lastMonth ? 'text-success' : 'text-danger'}>
                  <i className={`bi bi-arrow-${stats.sales.current > stats.sales.lastMonth ? 'up' : 'down'}`}></i>
                  {Math.abs(((stats.sales.current - stats.sales.lastMonth) / stats.sales.lastMonth * 100)).toFixed(1)}%
                </span>
              </div>
              <i className="bi bi-graph-up" style={{ fontSize: 40, color: '#28a745' }}></i>
            </div>
            <button 
              className="btn btn-sm btn-outline-success mt-2"
              onClick={() => navigate('/sales')}
            >
              Details...
            </button>
          </div>
        </div>

        {/* Compras */}
        <div className="col-lg-4 p-2">
          <div className="border p-3 rounded bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="text-muted">PURCHASES</h5>
                <h2 className="text-primary">${stats.purchases.current.toLocaleString()}</h2>
                <span className={stats.purchases.current < stats.purchases.lastMonth ? 'text-success' : 'text-danger'}>
                  <i className={`bi bi-arrow-${stats.purchases.current < stats.purchases.lastMonth ? 'down' : 'up'}`}></i>
                  {Math.abs(((stats.purchases.current - stats.purchases.lastMonth) / stats.purchases.lastMonth * 100)).toFixed(1)}%
                </span>
              </div>
              <i className="bi bi-cart-check" style={{ fontSize: 40, color: '#007bff' }}></i>
            </div>
            <button 
              className="btn btn-sm btn-outline-primary mt-2"
              onClick={() => navigate('/purchases')}
            >
              Details...
            </button>
          </div>
        </div>

        {/* Inventario */}
        <div className="col-lg-4 p-2">
          <div className="border p-3 rounded bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="text-muted">INVENTORY</h5>
                <h2 className="text-warning">{stats.inventory.totalItems} items</h2>
                <span className="text-danger">
                  <i className="bi bi-exclamation-triangle"></i> {stats.inventory.lowStock} low stock
                </span>
              </div>
              <i className="bi bi-box-seam" style={{ fontSize: 40, color: '#ffc107' }}></i>
            </div>
            <button 
              className="btn btn-sm btn-outline-warning mt-2"
              onClick={() => navigate('/inventory')}
            >
              Details...
            </button>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row mb-4">
        {/* Gráfico de Barras - Ventas Mensuales */}
        <div className="col-lg-8 p-2">
          <div className="border p-3 rounded bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>LAST 6 MONTS SALES</h5>
              <select className="input-text form-control" style={{ width: '150px' }}>
                <option>Order By</option>
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>
            <BarChart 
              data={[12000, 19000, 15000, 18000, 21000, 25000]}
              labels={['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']}
              color="#28a745"
            />
          </div>
        </div>

        {/* Gráfico de Pie - Top Productos */}
        <div className="col-lg-4 p-2">
          <div className="border p-3 rounded bg-white">
            <h5 className="mb-3">TOP PRODUCTS</h5>
            <PieChart 
              data={stats.topProducts.map(p => p.value)}
              labels={stats.topProducts.map(p => p.name)}
              colors={['#007bff', '#28a745', '#ffc107', '#dc3545']}
            />
          </div>
        </div>
      </div>

      {/* Alertas y Acciones Rápidas */}
      <div className="row">
        {/* Alertas */}
        <div className="col-lg-6 p-2">
          <div className="border p-3 rounded bg-white">
            <h5 className="mb-3">
              <i className="bi bi-exclamation-triangle text-danger"></i> ALERTS
            </h5>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                OUT OF STOCK
                <span className="badge bg-danger rounded-pill">5</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Órdenes pendientes
                <span className="badge bg-warning rounded-pill">3</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Pagos vencidos
                <span className="badge bg-danger rounded-pill">2</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="col-lg-6 p-2">
          <div className="border p-3 rounded bg-white">
            <h5 className="mb-3">
              <i className="bi bi-lightning-charge text-primary"></i> ACCIONES RÁPIDAS
            </h5>
            <div className="d-flex flex-wrap gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/sales/new')}
              >
                <i className="bi bi-cart-plus"></i> Nueva Venta
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => navigate('/purchases/new')}
              >
                <i className="bi bi-box-seam"></i> Nueva Compra
              </button>
              <button 
                className="btn btn-outline-warning"
                onClick={() => navigate('/inventory/adjustment')}
              >
                <i className="bi bi-clipboard-minus"></i> Ajuste Inventario
              </button>
              <button 
                className="btn btn-outline-info"
                onClick={() => navigate('/reports/generate')}
              >
                <i className="bi bi-file-earmark-bar-graph"></i> Generar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;