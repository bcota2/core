import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import suppliersRouter from "./routes/suppliers.js";
import purchaseOrders from "./routes/purchaseOrders.js";
import quotesRoutes from "./routes/quotes.js";
import customersRoutes from "./routes/customers.js";
import salesRoutes from "./routes/sales.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportRoutes from "./routes/report.js";

import "./init.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/purchase-orders", purchaseOrders);
app.use("/api/quotes", quotesRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`Servidor SQLite corriendo en http://localhost:${PORT}`);
});
