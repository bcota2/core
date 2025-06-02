import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SideMenu from "./layout/Sidebar.jsx";
import Inventory from "./pages/Inventory.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Sales from "./pages/Sales.jsx";
import { PurchaseOrders, PurchaseOrdersList, ViewPurchaseOrder } from "./pages/PurchaseOrders.jsx";
import Reports from "./pages/Reports.jsx";
import { Products, ProductForm } from "./pages/Products.jsx";
import { Categories, CategoryForm } from "./pages/Categories.jsx";
import PurchaseSuppliers from "./pages/PurchaseSuppliers.jsx";
import Quotes from "./pages/Quotes.jsx";
import Adjustement from "./pages/InventoryAdjustement.jsx";
import Transfer from "./pages/Transfer.jsx";
import ReportsGenerate from "./pages/ReportsGenerate.jsx";
import Customers from "./pages/Customers.jsx";

function App() {
  return (
    <Router>
      <div className="app-layout" style={{ display: "flex" }}>
        <SideMenu />
        <main className="main-content" style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/customers" element={<Customers />} />
            <Route path="/purchase/orders" element={<PurchaseOrders />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersList />} />
            <Route path="/purchase-orders/view/:id"element={<ViewPurchaseOrder />} />
            <Route path="/purchase/suppliers" element={<PurchaseSuppliers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/generate" element={<ReportsGenerate />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />{" "}
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            <Route
              path="/categories/edit/:id"
              element={<CategoryForm />}
            />{" "}
            <Route path="/sales/quotes" element={<Quotes />} />
            <Route path="/inventory/adjustment" element={<Adjustement />} />
            <Route path="/inventory/transfer" element={<Transfer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
