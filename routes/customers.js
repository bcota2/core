import express from "express";
import db from "../db/sqlite.js";

const router = express.Router();

// Obtener todos los clientes
router.get("/", (req, res) => {
  try {
    const clientes = db
      .prepare("SELECT * FROM Clientes ORDER BY ClienteID DESC")
      .all();
    res.json(clientes);
  } catch (err) {
    console.error("Error al obtener clientes:", err.message);
    res.status(500).json({ message: "Error interno" });
  }
});

// Agregar cliente
router.post("/", (req, res) => {
  const { Nombre, RFC, Telefono, Correo, Direccion } = req.body;

  if (!Nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio." });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO Clientes (Nombre, RFC, Telefono, Correo, Direccion)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(Nombre, RFC, Telefono, Correo, Direccion);

    res
      .status(201)
      .json({ message: "Cliente creado", ClienteID: result.lastInsertRowid });
  } catch (err) {
    console.error("Error al agregar cliente:", err.message);
    res.status(500).json({ message: "Error interno al agregar cliente" });
  }
});

export default router;
