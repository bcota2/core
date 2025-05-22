import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import suppliersRouter from "./routes/suppliers.js";
import purchaseOrders from "./routes/purchaseOrders.js";

import "./init.js"; // Crear tabla si no existe

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/purchase-orders", purchaseOrders);


app.listen(PORT, () => {
  console.log(`Servidor SQLite corriendo en http://localhost:${PORT}`);
});
