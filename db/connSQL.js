import mssql from "mssql";

const connectionSettings = {
  server: "BRAYAN",
  database: "ProyectoWEB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  authentication: {
    type: "default",
  },
};

export async function getConnection() {
  try {
    return await mssql.connect(connectionSettings);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

export { mssql };
