import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2pdf from 'html2pdf.js';
import logo from "../../assets/Logo.png";


export default function ExportExcelAndPDF({ exportData, type, reportTitle, isArabic }) {
    if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });
        saveAs(data, `${reportTitle}_${new Date().toISOString()}.xlsx`);
    } else if (type === "pdf") {
      


        const element = document.createElement('div');
        element.innerHTML = `
        <div style="font-family:Tahoma; direction:${isArabic ? "rtl" : "ltr"}; padding:20px;">
            <h2 style="text-align:center">${reportTitle}</h2>
            <!-- هنا Favicon -->
        <link rel="icon" href="${logo}" type="image/x-icon">
            <table border="1" style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr>
                        ${Object.keys(exportData[0] || {}).map(k =>
            `<th style="padding:10px; background:#f2f2f2;">${k}</th>`
        ).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${exportData.map(row => `
                        <tr>
                            ${Object.values(row).map(v =>
            `<td style="padding:8px;">${v || ''}</td>`
        ).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

        html2pdf()
            .set({
                margin: 10,
                filename: `${reportTitle}_${new Date().toISOString()}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            })
            .from(element)
            .save();

    } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
                                   <html>
                                     <head>
                                      <meta charset="UTF-8" />
                                       <title>Users Report</title>
                                       <style>
                                         table { width: 100%; border-collapse: collapse; }
                                         th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                                         th { background-color: #f2f2f2; }
                                       </style>
                                       
    <style>
      body {
        font-family: "Tahoma", "Arial", sans-serif;
        direction: rtl;
        text-align: right;
      }

      h2 {
        text-align: center;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        border: 1px solid #333;
        padding: 8px;
        text-align: right;
        font-size: 14px;
      }

      th {
        background-color: #f2f2f2;
      }
    </style>
                                     </head>
                                     <body>
                                       <h2>Users Report</h2>
                                       <table>
                                         <thead><tr>${Object.keys(exportData[0] || {})
                .map((k) => `<th>${k}</th>`)
                .join("")}</tr></thead>
                                         <tbody>${exportData
                .map(
                    (row) =>
                        `<tr>${Object.values(row)
                            .map((v) => `<td>${v}</td>`)
                            .join("")}</tr>`
                )
                .join("")}</tbody>
                                       </table>
                                     </body>
                                   </html>
                                 `;


        printableWindow.document.write(htmlContent);
        printableWindow.document.close();
        printableWindow.print();
    }
}