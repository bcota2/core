import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/dashboard/summary")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error al cargar dashboard:", err));
  }, []);

  if (!data) return <p className="p-4">Cargando dashboard...</p>;

  return (
    <div className="container-fluid">
      <div className="row text-center my-4">
        <div className="col-lg-4">
          <h5>SALES</h5>
          <h3>${data?.totalVentas?.toFixed(2) || "0.00"}</h3>
          <p>↑ 27.6%</p>
        </div>
        <div className="col-lg-4">
          <h5>PURCHASES</h5>
          <h3>${data?.totalCompras?.toFixed(2) || "0.00"}</h3>
          <p>↓ 7.6%</p>
        </div>
        <div className="col-lg-4">
          <h5>INVENTORY</h5>
          <h3>{data?.totalProductos ?? 0} items</h3>
          <p className="text-danger">⚠ {data?.lowStock ?? 0} low stock</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <h5>Last 3 Months Sales</h5>
            <Bar
              data={{
                labels: (data?.ventasMensuales || []).map((v) => `Mes ${v.mes}`),
                datasets: [
                  {
                    label: "Ventas",
                    data: (data?.ventasMensuales || []).map((v) => v.total),
                    backgroundColor: "#4CAF50",
                  },
                ],
              }}
              height={200}
              />
        </div>

        <div className="col-lg-4">
          <h5>Top Products</h5>
          <Pie
            data={{
              labels: (data?.topProducts || []).map((p) => p.Nombre),
              datasets: [
                {
                  label: "Más vendidos",
                  data: (data?.topProducts || []).map((p) => p.totalVendido),
                  backgroundColor: [
                    "#2196F3",
                    "#4CAF50",
                    "#FFC107",
                    "#FF5722",
                    "#9C27B0",
                  ],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
