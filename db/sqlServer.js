import { getConnection, mssql } from "./connSQL.js";

const getProducts = async () => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Productos");
    console.log("Products fetched successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

const addProducts = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("ProductCode", mssql.VarChar(50), "PROD-030")
      .input("ProductName", mssql.VarChar(50), "Headphones Scullcandy")
      .input("Description", mssql.VarChar(255), "Hesh Second Generation")
      .input("CategoryID", mssql.Int, 1)
      .input("Price", mssql.Decimal(18, 2), 1299.0)
      .input("Stock", mssql.Int, 4)
      .input("Unit", mssql.VarChar(50), "PZA")
      .input("Status", mssql.VarChar(50), "Active")
      .query(
        "INSERT INTO Products (ProductCode, ProductName, Description, CategoryID, Price, Stock, Unit, Status) VALUES (@productCode, @productName, @description, @categoryID, @price, @stock, @unit, @status); "
      );
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

getProducts();
