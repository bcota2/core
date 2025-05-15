import db from "./db/sqlite.js";

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS Categorias (
    CategoriaID INTEGER PRIMARY KEY AUTOINCREMENT,
    Codigo TEXT NOT NULL,
    Nombre TEXT NOT NULL,
    CategoriaPadre INTEGER,
    Descripcion TEXT,
    Estado TEXT NOT NULL,
    Impuesto REAL,
    CodigoSAT TEXT,
    FOREIGN KEY (CategoriaPadre) REFERENCES Categorias(CategoriaID)
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS Proveedores (
    ProveedorID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    RFC TEXT,
    Contacto TEXT,
    Telefono TEXT,
    Email TEXT,
    SitioWeb TEXT,
    DiasCredito INTEGER,
    LimiteCredito REAL,
    CalleNumero TEXT,
    Colonia TEXT,
    CP TEXT,
    Ciudad TEXT,
    Estado TEXT,
    Pais TEXT,
    Banco TEXT,
    CLABE TEXT,
    NumCuenta TEXT,
    Moneda TEXT
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS Productos (
    ProductoID INTEGER PRIMARY KEY AUTOINCREMENT,
    Codigo TEXT NOT NULL,
    Nombre TEXT NOT NULL,
    CodigoBarras TEXT,
    Descripcion TEXT,
    CategoriaID INTEGER,
    Unidad TEXT,
    PrecioCompra REAL,
    PrecioVenta REAL,
    StockMinimo INTEGER,
    StockMaximo INTEGER,
    Ubicacion TEXT,
    ProveedorID INTEGER,
    Estado TEXT,
    NotasInternas TEXT,
    FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID),
    FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID)
  )
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS ProveedorProductos (
  ProveedorProductoID INTEGER PRIMARY KEY AUTOINCREMENT,
  ProveedorID INTEGER NOT NULL,
  Nombre TEXT NOT NULL,
  Codigo TEXT,
  TiempoEntrega TEXT,
  FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID)
)
`
).run();

console.log("Todas las tablas han sido creadas correctamente.");
