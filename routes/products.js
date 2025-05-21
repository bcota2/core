import express from "express";
import db from "../db/sqlite.js";

const router = express.Router();

router.get("/", (req, res) => {
  const stmt = db.prepare("SELECT * FROM Productos");
  const productos = stmt.all();
  res.json(productos);
});

// GET /api/products/filter?estado=Activo&categoria=2
router.get("/filter", (req, res) => {
  const { estado, categoria, buscar } = req.query;

  let query = `SELECT p.*, c.Nombre as CategoriaNombre
  FROM Productos p
  INNER JOIN Categorias c ON p.CategoriaID = c.CategoriaID
  WHERE 1=1`;
  const params = [];

  if (estado && estado !== "Todos") {
    query += " AND p.Estado = ?";
    params.push(estado);
  }

  if (categoria && categoria !== "") {
    query += " AND p.CategoriaID = ?";
    params.push(Number(categoria));
  }

    if (buscar && buscar.trim() !== "") {
    query += ` AND (p.Nombre LIKE ? OR p.Codigo LIKE ? OR p.Descripcion LIKE ?)`;
    const keyword = `%${buscar.trim()}%`;
    params.push(keyword, keyword, keyword);
  }

  const stmt = db.prepare(query);
  const productos = stmt.all(...params);

  res.json(productos);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare("SELECT * FROM Productos WHERE ProductoID = @id");
  const producto = stmt.get({ id: Number(id) });

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(producto);
});

router.post("/", (req, res) => {
  const data = req.body;

  const total = db
    .prepare("SELECT COUNT(*) as total FROM Productos")
    .get().total;
  const nuevoCodigo = `PROD-${String(total + 1).padStart(4, "0")}`;

  const codigoBarras =
    data.CodigoBarras && data.CodigoBarras.trim() !== ""
      ? data.CodigoBarras
      : Math.floor(Math.random() * 9000000000000 + 1000000000000).toString();

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
    NotasInternas: data.NotasInternas || "",
  });

  res.status(201).json({
    message: `Producto "${data.Nombre}" creado correctamente.`,
    Codigo: nuevoCodigo,
    CodigoBarras: codigoBarras,
  });
});

router.get("/next/code", (req, res) => {
  const total = db
    .prepare("SELECT COUNT(*) as total FROM Productos")
    .get().total;
  const nuevoCodigo = `PROD-${String(total + 1).padStart(4, "0")}`;
  const nuevoBarCode = Math.floor(
    Math.random() * 9000000000000 + 1000000000000
  ).toString();

  res.json({ codigo: nuevoCodigo, barCode: nuevoBarCode });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
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
    WHERE ProductoID = @ProductoID
  `);

  stmt.run({ ...data, ProductoID: id });

  res.json({ message: `Producto actualizado correctamente.` });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare("DELETE FROM Productos WHERE ProductoID = ?");
  stmt.run(id);

  res.json({ message: "Producto eliminado correctamente" });
});

export default router;
