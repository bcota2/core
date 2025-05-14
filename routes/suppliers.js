import express from "express";
import db from "../db/sqlite.js";

const router = express.Router();

// Obtener todos los proveedores
router.get("/", (req, res) => {
  const proveedores = db.prepare("SELECT * FROM Proveedores").all();
  res.json(proveedores);
});

// Crear un nuevo proveedor
router.post("/", (req, res) => {
  const data = req.body;

  const stmt = db.prepare(`
    INSERT INTO Proveedores (
      Nombre, RFC, Contacto, Telefono, Email, SitioWeb,
      DiasCredito, LimiteCredito, CalleNumero, Colonia, CP,
      Ciudad, Estado, Pais, Banco, CLABE, NumCuenta, Moneda
    ) VALUES (
      @Nombre, @RFC, @Contacto, @Telefono, @Email, @SitioWeb,
      @DiasCredito, @LimiteCredito, @CalleNumero, @Colonia, @CP,
      @Ciudad, @Estado, @Pais, @Banco, @CLABE, @NumCuenta, @Moneda
    )
  `);
  
  stmt.run(data);
  res.status(201).json({ message: "Proveedor registrado" });
});

// Eliminar proveedor por ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM Proveedores WHERE ProveedorID = ?").run(id);
  res.json({ message: "Proveedor eliminado" });
});

export default router;
