import express from "express";
import db from "../db/sqlite.js";
const router = express.Router();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dayjs from "dayjs";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/generate", async (req, res) => {
  const { tipo, nombre, formato, fecha_inicio, fecha_fin, almacen, categoria } =
    req.body;

  const fechaGeneracion = dayjs().format("YYYY-MM-DD HH:mm");
  const rangoFechas = `${dayjs(fecha_inicio).format("DD/MM")} - ${dayjs(
    fecha_fin
  ).format("DD/MM")}`;
  const generadoPor = "Admin"; // Puedes usar auth más adelante

  try {
    // 1. Insertar en DB
    const stmt = db.prepare(`
      INSERT INTO Reportes (nombre, tipo, formato, fecha_generacion, fecha_inicio, fecha_fin, rango_fechas, generado_por, almacen, categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      nombre,
      tipo,
      formato,
      fechaGeneracion,
      fecha_inicio,
      fecha_fin,
      rangoFechas,
      generadoPor,
      almacen,
      categoria
    );

    const reporteId = result.lastInsertRowid;

    let datos = [];

    if (tipo === "stock") {
      let query = `
    SELECT 
      p.nombre AS producto,
      p.stock,
      c.nombre AS categoria
    FROM Productos p
    LEFT JOIN Categorias c ON c.id = p.categoria_id
    WHERE 1=1
  `;
      const params = [];

      if (almacen) {
        query += " AND p.almacen_id = ?";
        params.push(almacen);
      }

      if (categoria) {
        query += " AND p.categoria_id = ?";
        params.push(categoria);
      }

      const stmt = db.prepare(query);
      datos = stmt.all(...params);
    }

    // 2. Crear carpeta si no existe
    const outputDir = path.join(__dirname, "..", "reportes");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // 3. Generar PDF
    if (formato === "pdf" || formato === "both") {
      const doc = new PDFDocument();
      const pdfPath = path.join(outputDir, `reporte_${reporteId}.pdf`);
      doc.pipe(fs.createWriteStream(pdfPath));

      doc.fontSize(20).text(`Reporte: ${nombre}`, { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Tipo: ${tipo}`);
      doc.text(`Fechas: ${rangoFechas}`);
      doc.text(`Generado por: ${generadoPor}`);
      doc.text(`Fecha: ${fechaGeneracion}`);
      doc.moveDown();

      // Agregar datos si es tipo stock
      if (tipo === "stock" && datos.length > 0) {
        doc
          .fontSize(14)
          .text("Stock Actual de Productos:", { underline: true })
          .moveDown();

        datos.forEach((item, index) => {
          doc.text(
            `${index + 1}. ${item.producto} - Stock: ${item.stock} - Almacén: ${
              item.almacen || "N/A"
            } - Categoría: ${item.categoria || "N/A"}`
          );
        });
      }

      doc.end();
    }

    // 4. Generar Excel
    if (formato === "excel" || formato === "both") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Reporte");

      sheet.addRow(["Nombre del Reporte", nombre]);
      sheet.addRow(["Tipo", tipo]);
      sheet.addRow(["Fechas", rangoFechas]);
      sheet.addRow(["Generado Por", generadoPor]);
      sheet.addRow(["Fecha Generación", fechaGeneracion]);

      if (tipo === "stock" && datos.length > 0) {
        sheet.addRow([]);
        sheet.addRow(["#", "Producto", "Stock", "Almacén", "Categoría"]);

        datos.forEach((item, index) => {
          sheet.addRow([
            index + 1,
            item.producto,
            item.stock,
            item.almacen || "N/A",
            item.categoria || "N/A",
          ]);
        });
      }

      const excelPath = path.join(outputDir, `reporte_${reporteId}.xlsx`);
      await workbook.xlsx.writeFile(excelPath);
    }

    res.status(201).json({ message: "Reporte generado", id: reporteId });
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    res.status(500).json({ error: "No se pudo generar el reporte" });
  }
});

router.get("/download/pdf/:id", (req, res) => {
  const { id } = req.params;

  const filePath = path.join(__dirname, "..", "reportes", `reporte_${id}.pdf`);

  if (fs.existsSync(filePath)) {
    res.download(filePath); // fuerza descarga en el navegador
  } else {
    res.status(404).json({ error: "Archivo PDF no encontrado" });
  }
});

router.get("/download/excel/:id", (req, res) => {
  const { id } = req.params;

  const filePath = path.join(__dirname, "..", "reportes", `reporte_${id}.xlsx`);

  if (fs.existsSync(filePath)) {
    res.download(filePath); // fuerza descarga en el navegador
  } else {
    res.status(404).json({ error: "Archivo Excel no encontrado" });
  }
});

router.get("/", (req, res) => {
  const { tipo, almacen, inicio, fin } = req.query;

  let query = `SELECT * FROM Reportes WHERE 1=1`;
  const params = [];

  if (tipo) {
    query += ` AND tipo = ?`;
    params.push(tipo);
  }

  if (almacen) {
    query += ` AND almacen = ?`;
    params.push(almacen);
  }

  if (inicio && fin) {
    query += ` AND fecha_generacion BETWEEN ? AND ?`;
    params.push(inicio, fin);
  } else if (inicio) {
    query += ` AND fecha_generacion >= ?`;
    params.push(inicio);
  } else if (fin) {
    query += ` AND fecha_generacion <= ?`;
    params.push(fin);
  }

  query += ` ORDER BY fecha_generacion DESC`;

  try {
    const stmt = db.prepare(query);
    const reportes = stmt.all(...params);
    res.json(reportes);
  } catch (error) {
    console.error("Error consultando reportes:", error);
    res.status(500).json({ error: "Error al consultar reportes" });
  }
});

export default router;
