import express from "express";
import db from "../db/sqlite.js";
const router = express.Router();

// POST /api/quotes
router.post("/", (req, res) => {
  const {
    quoteNumber,
    quoteDate,
    clienteID,
    moneda,
    validezDias,
    condiciones,
    notasInternas,
    descuentoGlobal,
    vendedorID,
    status,
    items,
  } = req.body;

  const insertQuote = db.prepare(`
    INSERT INTO Quotes (
      QuoteNumber, QuoteDate, ClienteID, Moneda, ValidezDias,
      Condiciones, NotasInternas, DescuentoGlobal,
      VendedorID, Estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertItem = db.prepare(`
    INSERT INTO QuoteItems (
      QuoteID, ProductoID, Unidad, PrecioUnitario,
      Cantidad, DescuentoUnitario, Total
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    const result = insertQuote.run(
      quoteNumber,
      quoteDate,
      clienteID,
      moneda,
      validezDias,
      condiciones,
      notasInternas,
      descuentoGlobal,
      vendedorID,
      status
    );

    const quoteID = result.lastInsertRowid;

    for (const item of items) {
      insertItem.run(
        quoteID,
        item.productoID,
        item.unidad,
        item.precioUnitario,
        item.cantidad,
        item.descuentoUnitario,
        item.total
      );
    }

    return quoteID;
  });

  try {
    const newQuoteID = transaction();
    res
      .status(201)
      .json({ message: "Cotización guardada", quoteID: newQuoteID });
  } catch (err) {
    console.error("Error al guardar cotización:", err.message);
    res.status(500).json({ message: "Error interno al guardar la cotización" });
  }
});

router.get("/next-number", (req, res) => {
  try {
    const year = new Date().getFullYear();
    const prefix = `QT-${year}-`;

    const result = db
      .prepare(
        `
      SELECT QuoteNumber FROM Quotes
      WHERE QuoteNumber LIKE ?
      ORDER BY QuoteID DESC
      LIMIT 1
    `
      )
      .get(`${prefix}%`);

    let next = 1;

    if (result && result.QuoteNumber) {
      const parts = result.QuoteNumber.split("-");
      if (parts.length === 3) {
        next = parseInt(parts[2]) + 1;
      }
    }

    const formatted = `${prefix}${String(next).padStart(4, "0")}`;
    res.json({ nextQuoteNumber: formatted });
  } catch (err) {
    console.error("Error generando número de cotización:", err.message);
    res
      .status(500)
      .json({ message: "Error interno al generar número de cotización" });
  }
});

router.get("/by-folio/:folio", (req, res) => {
  const { folio } = req.params;
  const { estado } = req.query;

  try {
    let query = "SELECT * FROM Quotes WHERE QuoteNumber = ?";
    const params = [folio];

    if (estado) {
      query += " AND Estado = ?";
      params.push(estado);
    }

    const quote = db.prepare(query).get(...params);

    if (!quote) {
      return res
        .status(404)
        .json({ message: "Cotización no encontrada con ese estado" });
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

    res.json({ quote, items });
  } catch (err) {
    console.error("Error cargando cotización:", err.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const {
    quoteDate,
    clienteID,
    moneda,
    validezDias,
    condiciones,
    notasInternas,
    descuentoGlobal,
    vendedorID,
    items,
    status,
  } = req.body;

  const updateQuote = db.prepare(`
    UPDATE Quotes SET
      QuoteDate = ?, ClienteID = ?, Moneda = ?, ValidezDias = ?,
      Condiciones = ?, NotasInternas = ?, DescuentoGlobal = ?,
      VendedorID = ?, Estado = ?
    WHERE QuoteID = ?
  `);

  const deleteItems = db.prepare(`DELETE FROM QuoteItems WHERE QuoteID = ?`);

  const insertItem = db.prepare(`
    INSERT INTO QuoteItems (
      QuoteID, ProductoID, Unidad, PrecioUnitario,
      Cantidad, DescuentoUnitario, Total
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    updateQuote.run(
      quoteDate,
      clienteID,
      moneda,
      validezDias,
      condiciones,
      notasInternas,
      descuentoGlobal,
      vendedorID,
      status,
      id
    );

    deleteItems.run(id);

    for (const item of items) {
      insertItem.run(
        id,
        item.productoID,
        item.unidad,
        item.precioUnitario,
        item.cantidad,
        item.descuentoUnitario,
        item.total
      );
    }
  });

  try {
    tx();
    res.json({ message: "Cotización actualizada correctamente" });
  } catch (err) {
    console.error("Error actualizando cotización:", err.message);
    res.status(500).json({ message: "Error interno al actualizar cotización" });
  }
});

export default router;
