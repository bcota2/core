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
  const data = req.body;

  // Contar productos para generar nuevo código
  const total = db.prepare("SELECT COUNT(*) as total FROM Productos").get().total;
  const nuevoCodigo = `PROD-${String(total + 1).padStart(4, "0")}`;

  // Generar código de barras aleatorio si no viene uno
  const codigoBarras =
    data.CodigoBarras && data.CodigoBarras.trim() !== ""
      ? data.CodigoBarras
      : Math.floor(Math.random() * 9000000000000 + 1000000000000).toString(); // 13 dígitos

  const stmt = db.prepare(`
    INSERT INTO Productos (
      Codigo, Nombre, CodigoBarras, Descripcion,
      CategoriaID, Unidad, PrecioCompra, PrecioVenta,
      StockMinimo, StockMaximo, ProveedorID, Estado, NotasInternas
    ) VALUES (
      @Codigo, @Nombre, @CodigoBarras, @Descripcion,
      @CategoriaID, @Unidad, @PrecioCompra, @PrecioVenta,
      @StockMinimo, @StockMaximo, @ProveedorID, @Estado, @NotasInternas
    )
  `);

  stmt.run({
    Codigo: nuevoCodigo,
    Nombre: data.Nombre,
    CodigoBarras: codigoBarras,
    Descripcion: data.Descripcion || "",
    CategoriaID: parseInt(data.CategoriaID),
    Unidad: data.Unidad,
    PrecioCompra: parseFloat(data.PrecioCompra),
    PrecioVenta: parseFloat(data.PrecioVenta),
    StockMinimo: parseInt(data.StockMinimo),
    StockMaximo: parseInt(data.StockMaximo),
    ProveedorID: parseInt(data.ProveedorID),
    Estado: data.Estado,
    NotasInternas: data.NotasInternas || ""
  });

  res.status(201).json({
    message: `Producto "${data.Nombre}" creado correctamente.`,
    Codigo: nuevoCodigo,
    CodigoBarras: codigoBarras
  });
});

// Eliminar
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM Productos WHERE ProductoID = ?").run(id);
  res.json({ message: "Producto Eliminado" });
});

// Actualizar categoría existente
router.put("/:id", (req, res) => {
  const { id } = req.params.id;
  const data = req.body;

  const stmt = db.prepare(`
    UPDATE Productos SET
      Nombre = @Nombre, 
      CodigoBarras = @CodigoBarras, 
      Descripcion = @Descripcion,
      CategoriaID = @CategoriaID,
      Unidad = @Unidad, 
      PrecioCompra = @PrecioCompra, 
      PrecioVenta = @PrecioVenta,
      StockMinimo = @StockMinimo, 
      StockMaximo = @StockMaximo, 
      ProveedorID = @ProveedorID, 
      Estado = @Estado, 
      NotasInternas = @NotasInternas
    WHERE ProductoID = @id
  `);

  stmt.run({ ...data, ProductoID: id });
  res.json({ message: "Producto actualizado correctamente." });
});


export default router;
