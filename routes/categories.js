import express from "express";
import db from "../db/sqlite.js";

const router = express.Router();

// Obtener todas las categorías
router.get("/for/products", (req, res) => {
  const categorias = db.prepare("SELECT * FROM Categorias").all();
  res.json(categorias);
});

router.get("/filter", (req, res) => {
  const { estado, buscar } = req.query;

  let query = `SELECT * FROM Categorias WHERE 1=1`;
  const params = [];

  if (estado && estado !== "Todas") {
    query += " AND Estado = ?";
    params.push(estado);
  }
  if (buscar && buscar.trim() !== "") {
    query += ` AND (Nombre LIKE ? OR Codigo LIKE ?)`;
    const keyword = `%${buscar.trim()}%`;
    params.push(keyword, keyword);
  }

  const stmt = db.prepare(query);
  const categorias = stmt.all(...params);

  res.json(categorias);
});



// Crear nueva categoría
router.post("/", (req, res) => {
  const data = req.body;

  // Obtener el total actual de registros
  const count = db
    .prepare("SELECT COUNT(*) as total FROM Categorias")
    .get().total;

  // Generar código único (ej: CAT-0010)
  const nuevoCodigo = `CAT-${(count + 1).toString().padStart(4, "0")}`;

  const stmt = db.prepare(`
    INSERT INTO Categorias (
      Codigo, Nombre, CategoriaPadre, Descripcion,
      Estado, Impuesto, CodigoSAT
    ) VALUES (
      @Codigo, @Nombre, @CategoriaPadre, @Descripcion,
      @Estado, @Impuesto, @CodigoSAT
    )
  `);

  stmt.run({
    ...data,
    Codigo: nuevoCodigo,
    CategoriaPadre: data.CategoriaPadre,
  });

  res
    .status(201)
    .json({ message: "Categoría creada con código " + nuevoCodigo });
});

// Eliminar categoría
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM Categorias WHERE CategoriaID = ?").run(id);
  res.json({ message: "Categoría eliminada" });
});

// Actualizar categoría existente
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const stmt = db.prepare(`
    UPDATE Categorias SET
      Codigo = @Codigo,
      Nombre = @Nombre,
      CategoriaPadre = @CategoriaPadre,
      Descripcion = @Descripcion,
      Estado = @Estado,
      Impuesto = @Impuesto,
      CodigoSAT = @CodigoSAT
    WHERE CategoriaID = @id
  `);

  stmt.run({ ...data, id });
  res.json({ message: "Categoría actualizada correctamente" });
});

export default router;
