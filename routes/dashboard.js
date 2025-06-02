import express from "express";
import db from "../db/sqlite.js";

const router = express.Router();

// Obtener resumen para Dashboard
router.get("/summary", (req, res) => {
  try {
    const totalVentas =
      db.prepare("SELECT SUM(Total) as total FROM Ventas").get()?.total || 0;
    const totalCompras =
      db.prepare("SELECT SUM(Total) as total FROM PurchaseOrders").get()
        ?.total || 0;
    const totalProductos =
      db.prepare("SELECT COUNT(*) as total FROM Productos").get()?.total || 0;
    const lowStock =
      db
        .prepare(
          "SELECT COUNT(*) as total FROM Productos WHERE Stock < StockMinimo"
        )
        .get()?.total || 0;

    const ventasMensuales = db
      .prepare(
        `
      SELECT strftime('%m', Fecha) as mes, SUM(Total) as total
      FROM Ventas
      WHERE Fecha >= date('now', '-6 months')
      GROUP BY mes
      ORDER BY mes
    `
      )
      .all();

    const topProducts = db
      .prepare(
        `
      SELECT p.Nombre, SUM(vi.Cantidad) as totalVendido
      FROM VentaItems vi
      JOIN Productos p ON vi.ProductoID = p.ProductoID
      GROUP BY vi.ProductoID
      ORDER BY totalVendido DESC
      LIMIT 5
    `
      )
      .all();

    res.json({
      totalVentas,
      totalCompras,
      totalProductos,
      lowStock,
      ventasMensuales,
      topProducts,
    });
  } catch (err) {
    console.error("Error cargando resumen Dashboard:", err.message);
    res.status(500).json({ message: "Error al obtener resumen" });
  }
});

export default router;
