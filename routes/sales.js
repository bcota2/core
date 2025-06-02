import express from "express";
import db from "../db/sqlite.js";
const router = express.Router();

// Obtener datos de cotización para cargar a la venta
router.get("/from-quote/:folio", (req, res) => {
  const { folio } = req.params;

  try {
    const quote = db
      .prepare(
        `
      SELECT * FROM Quotes WHERE QuoteNumber = ? AND Estado = 'Finalizada'
    `
      )
      .get(folio);

    if (!quote) {
      return res
        .status(404)
        .json({ message: "Cotización no encontrada o no finalizada." });
    }

    const items = db
      .prepare(
        `
      SELECT qi.*, p.Nombre AS NombreProducto
      FROM QuoteItems qi
      JOIN Productos p ON p.ProductoID = qi.ProductoID
      WHERE qi.QuoteID = ?
    `
      )
      .all(quote.QuoteID);

    const cliente = db
      .prepare(`SELECT * FROM Clientes WHERE ClienteID = ?`)
      .get(quote.ClienteID);

    res.json({ quote, items, cliente });
  } catch (err) {
    console.error("Error al cargar cotización:", err.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Registrar venta
router.post("/", (req, res) => {
  const { clienteID, metodoPago, total, descuento, iva, productos } = req.body;

  const fechaVenta = new Date().toISOString();

  const insertVenta = db.prepare(`
    INSERT INTO Ventas (ClienteID, Fecha, MetodoPago,DescuentoGlobal,Iva, Total)
    VALUES (?, ?, ?, ?, ?, ?)
    `);

  const result = insertVenta.run(
    clienteID,
    fechaVenta,
    metodoPago,
    descuento,
    iva,
    total
  );

  const ventaID = result.lastInsertRowid;

  const insertItem = db.prepare(`
    INSERT INTO VentaItems (VentaID, ProductoID, NombreProducto,Unidad,  PrecioUnitario, Cantidad, DescuentoUnitario, Total)
    VALUES (?, ?, ?, ?, ?, ?,?,?)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insertItem.run(
        ventaID,
        item.ProductoID,
        item.NombreProducto,
        item.PrecioUnitario,
        item.Unidad,
        item.Cantidad,
        item.Descuento,
        item.Total
      );
    }
  });

  // Descontar del inventario
  const updateStock = db.prepare(`
  UPDATE Productos
  SET Stock = Stock - ?
  WHERE ProductoID = ?
`);
  insertMany(productos);

  for (const item of productos) {
    updateStock.run(item.Cantidad, item.ProductoID);
  }

  res.json({ message: "Venta registrada correctamente" });
});

// Endpoint para generar el siguiente SaleNumber
router.get("/next-number", (req, res) => {
  const year = new Date().getFullYear();
  const prefix = `SALE-${year}-`;

  try {
    const result = db
      .prepare(
        `
      SELECT SaleNumber FROM Ventas
      WHERE SaleNumber LIKE ?
      ORDER BY SaleID DESC
      LIMIT 1
    `
      )
      .get(`${prefix}%`);

    let nextNumber;
    if (!result) {
      nextNumber = `${prefix}0001`;
    } else {
      const lastNumber = parseInt(result.SaleNumber.replace(prefix, ""));
      nextNumber = `${prefix}${String(lastNumber + 1).padStart(4, "0")}`;
    }

    res.json({ nextSaleNumber: nextNumber });
  } catch (err) {
    console.error("Error generando SaleNumber:", err.message);
    res.status(500).json({ message: "Error interno generando SaleNumber" });
  }
});

// GET /api/sales/total
router.get("/sales/total", (req, res) => {
  const result = db
    .prepare(`SELECT SUM(Total) AS totalVentas FROM Ventas`)
    .get();
  res.json({ totalVentas: result.totalVentas || 0 });
});

export default router;
