import express from "express";
import db from "../db/sqlite.js";

const router = express.Router();

// Obtener todos
router.get("/", (req, res) => {
  const productos = db.prepare("SELECT * FROM Productos").all();
  res.json(productos);
});

// Agregar
router.post("/", (req, res) => {
  const {
    ProductCode, ProductName, Description,
    Category, Price, Stock, Unit, Status
  } = req.body;

  const stmt = db.prepare(`
    INSERT INTO Productos 
    (ProductCode, ProductName, Description, Category, Price, Stock, Unit, Status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(ProductCode, ProductName, Description, Category, Price, Stock, Unit, Status);

  res.status(201).json({ message: "Producto creado" });
});

// Eliminar
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM Productos WHERE ProductID = ?").run(id);
  res.json({ message: "Producto eliminado" });
});

export default router;
