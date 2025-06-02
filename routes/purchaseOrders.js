import express from "express";
import db from "../db/sqlite.js";

const router = express.Router();

router.post("/", (req, res) => {
  const {
    orderNumber,
    orderDate,
    expectedDelivery,
    supplierID,
    warehouseID,
    notes,
    shipping,
    status,
    items,
  } = req.body;

  if (
    !orderNumber ||
    !orderDate ||
    !expectedDelivery ||
    !supplierID ||
    !warehouseID ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Faltan campos requeridos o productos." });
  }

  // Calcular totales
  let subtotal = 0;
  let taxTotal = 0;

  for (const item of items) {
    const qty = parseFloat(item.quantity);
    const cost = parseFloat(item.unitCost);
    const tax = parseFloat(item.tax);

    const itemSubtotal = qty * cost;
    const itemTax = (itemSubtotal * tax) / 100;
    subtotal += itemSubtotal;
    taxTotal += itemTax;
  }

  const total = subtotal + taxTotal + parseFloat(shipping || 0);

  try {
    const insertOrder = db.prepare(`
      INSERT INTO PurchaseOrders 
      (OrderNumber,OrderDate, ExpectedDelivery, SupplierID, WarehouseID, 
      Notes, Shipping, Status, Subtotal, TaxTotal, Total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertOrder.run(
      orderNumber,
      orderDate,
      expectedDelivery,
      supplierID,
      warehouseID,
      notes,
      shipping,
      status,
      subtotal,
      taxTotal,
      total
    );

    const purchaseOrderID = result.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO PurchaseOrderItems 
      (PurchaseOrderID, ProductoID, SKU, Quantity, UnitCost, Tax, Total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertItem.run(
          purchaseOrderID,
          item.productoID,
          item.sku,
          item.quantity,
          item.unitCost,
          item.tax,
          item.total
        );
      }
    });

    insertMany(items);

    res.status(201).json({
      message: "Orden guardada correctamente",
      orderID: purchaseOrderID,
    });
  } catch (err) {
    console.error("Error al guardar orden:", err);
    res.status(500).json({ message: "Error interno al guardar la orden" });
  }
});

router.get("/next-number", (req, res) => {
  try {
    const year = new Date().getFullYear();
    const prefix = `PO-${year}-`;

    const query = `
      SELECT OrderNumber FROM PurchaseOrders
      WHERE OrderNumber IS NOT NULL AND OrderNumber LIKE ?
      ORDER BY PurchaseOrderID DESC
      LIMIT 1
    `;

    let nextNumber = 1;
    const result = db.prepare(query).get(`${prefix}%`);

    if (result && result.OrderNumber) {
      const parts = result.OrderNumber.split("-");
      if (parts.length === 3 && !isNaN(parts[2])) {
        nextNumber = parseInt(parts[2]) + 1;
      }
    }

    const formatted = `${prefix}${String(nextNumber).padStart(4, "0")}`;
    res.json({ nextOrderNumber: formatted });
  } catch (err) {
    console.error("Error generando número de orden:", err.message);
    res
      .status(500)
      .json({ message: "Error interno generando número de orden" });
  }
});

router.get("/", (req, res) => {
  try {
    const orders = db
      .prepare(
        `
      SELECT po.PurchaseOrderID, po.OrderNumber, po.OrderDate, po.Status, po.Total,
             s.Nombre AS SupplierName
      FROM PurchaseOrders po
      JOIN Proveedores s ON po.SupplierID = s.ProveedorID
      ORDER BY po.PurchaseOrderID DESC
    `
      )
      .all();

    res.json(orders);
  } catch (err) {
    console.error("Error al obtener órdenes:", err.message);
    res.status(500).json({ message: "Error interno al obtener órdenes" });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const order = db
      .prepare(
        `
      SELECT * FROM PurchaseOrders
      WHERE PurchaseOrderID = ?
    `
      )
      .get(id);

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const items = db
      .prepare(
        `
      SELECT poi.*, p.Nombre AS NombreProducto
      FROM PurchaseOrderItems poi
      JOIN Productos p ON poi.ProductoID = p.ProductoID
      WHERE poi.PurchaseOrderID = ?
    `
      )
      .all(id);

    res.json({ order, items });
  } catch (err) {
    console.error("Error al cargar orden:", err.message);
    res.status(500).json({ message: "Error interno al cargar la orden" });
  }
});

router.post("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const update = db.prepare(`
      UPDATE PurchaseOrders SET Status = ?
      WHERE PurchaseOrderID = ?
    `);
    const result = update.run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json({ message: "Estado actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar estado:", err.message);
    res.status(500).json({ message: "Error interno" });
  }
});

export default router;
