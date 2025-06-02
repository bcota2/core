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

db.prepare(
  `CREATE TABLE IF NOT EXISTS PurchaseOrders (
  PurchaseOrderID INTEGER PRIMARY KEY AUTOINCREMENT,
  OrderDate TEXT,
  ExpectedDelivery TEXT,
  SupplierID INTEGER,
  WarehouseID INTEGER,
  Notes TEXT,
  Shipping REAL,
  Status TEXT,
  Subtotal REAL,
  TaxTotal REAL,
  Total REAL
);
`
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS PurchaseOrderItems (
  ItemID INTEGER PRIMARY KEY AUTOINCREMENT,
  PurchaseOrderID INTEGER,
  ProductoID INTEGER,
  SKU TEXT,
  Quantity INTEGER,
  UnitCost REAL,
  Tax REAL,
  Total REAL,
  FOREIGN KEY (PurchaseOrderID) REFERENCES PurchaseOrders(PurchaseOrderID)
);
`
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS Clientes (
  ClienteID INTEGER PRIMARY KEY AUTOINCREMENT,
  Nombre TEXT,
  RFC TEXT,
  Telefono TEXT,
  Correo TEXT,
  Direccion TEXT
  );`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS Usuarios (
    UsuarioID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Correo TEXT UNIQUE,
    Rol TEXT DEFAULT 'Vendedor',
    Usuario TEXT UNIQUE,
    PasswordHash TEXT,
    Estado TEXT DEFAULT 'Activo',
    FechaRegistro TEXT
  );
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS Quotes (
  QuoteID INTEGER PRIMARY KEY AUTOINCREMENT,
  QuoteNumber TEXT,
  QuoteDate TEXT,
  ClienteID INTEGER,
  Moneda TEXT,
  ValidezDias INTEGER,
  Condiciones TEXT,
  NotasInternas TEXT,
  DescuentoGlobal REAL,
  VendedorID INTEGER,
  Estado TEXT
);
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS QuoteItems (
  ItemID INTEGER PRIMARY KEY AUTOINCREMENT,
  QuoteID INTEGER,
  ProductoID INTEGER,
  Unidad TEXT,
  PrecioUnitario REAL,
  Cantidad INTEGER,
  DescuentoUnitario REAL,
  Total REAL
);

`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS Ventas (
  VentaID INTEGER PRIMARY KEY AUTOINCREMENT,
  ClienteID INTEGER,
  Fecha TEXT,
  MetodoPago TEXT,
  EfectivoRecibido REAL,
  DescuentoGlobal REAL,
  Subtotal REAL,
  Iva REAL,
  Total REAL,
  Estado TEXT DEFAULT 'Completada',
  FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS VentaItems (
  VentaItemID INTEGER PRIMARY KEY AUTOINCREMENT,
  VentaID INTEGER,
  ProductoID INTEGER,
  NombreProducto TEXT,
  Unidad TEXT,
  PrecioUnitario REAL,
  Cantidad INTEGER,
  DescuentoUnitario REAL,
  Total REAL,
  FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
  FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS Reportes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  formato TEXT NOT NULL,
  fecha_generacion TEXT NOT NULL,
  fecha_inicio TEXT,
  fecha_fin TEXT,
  rango_fechas TEXT,
  generado_por TEXT,
  almacen TEXT,
  categoria TEXT
);

`
).run();

console.log("Todas las tablas han sido creadas correctamente.");
