"use client";

import jsPDF from "jspdf";

interface InvoiceData {
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  customerCity?: string;
  customerPostal?: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  shipping?: number;
  discount?: number;
}

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(0, 255, 136);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("GlisseGauloisse", 20, 25);
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text("Reparation & Vente de Trottinettes Electriques", 20, 33);

  // Invoice title
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`FACTURE ${data.orderNumber}`, 20, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Date : ${data.date}`, 20, 63);

  // Company info (right side)
  doc.setFontSize(9);
  doc.text("GlisseGauloisse", pageWidth - 70, 55);
  doc.text("49 Route de Margency", pageWidth - 70, 61);
  doc.text("95600 Eaubonne", pageWidth - 70, 67);
  doc.text("07 86 75 79 63", pageWidth - 70, 73);
  doc.text("contact@glissegauloisse.com", pageWidth - 70, 79);

  // Customer info
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("Facturer a :", 20, 85);
  doc.setFont("helvetica", "normal");
  doc.text(data.customerName || "Client", 20, 92);
  doc.text(data.customerEmail || "", 20, 98);
  if (data.customerAddress) doc.text(data.customerAddress, 20, 104);
  if (data.customerCity) doc.text(`${data.customerPostal || ""} ${data.customerCity}`, 20, 110);

  // Table header
  const tableTop = 125;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, tableTop, pageWidth - 40, 10, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Article", 25, tableTop + 7);
  doc.text("Qte", 120, tableTop + 7);
  doc.text("Prix unit.", 140, tableTop + 7);
  doc.text("Total", 170, tableTop + 7);

  // Table rows
  doc.setFont("helvetica", "normal");
  let y = tableTop + 17;
  for (const item of data.items) {
    doc.setTextColor(40, 40, 40);
    doc.text(item.name.substring(0, 40), 25, y);
    doc.text(String(item.quantity), 123, y);
    doc.text(`${item.price.toFixed(2)} EUR`, 140, y);
    doc.text(`${(item.price * item.quantity).toFixed(2)} EUR`, 170, y);
    y += 8;
  }

  // Totals
  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(120, y, pageWidth - 20, y);
  y += 8;

  doc.setFontSize(10);
  if (data.shipping && data.shipping > 0) {
    doc.text("Livraison :", 135, y);
    doc.text(`${data.shipping.toFixed(2)} EUR`, 170, y);
    y += 7;
  }
  if (data.discount && data.discount > 0) {
    doc.setTextColor(0, 180, 100);
    doc.text("Remise fidelite :", 130, y);
    doc.text(`-${data.discount.toFixed(2)} EUR`, 170, y);
    y += 7;
  }

  doc.setTextColor(10, 10, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL TTC :", 130, y + 2);
  doc.text(`${data.total.toFixed(2)} EUR`, 170, y + 2);

  // Footer
  const footerY = 270;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("GlisseGauloisse - Micro-entreprise", pageWidth / 2, footerY, { align: "center" });
  doc.text("49 Route de Margency, 95600 Eaubonne - 07 86 75 79 63", pageWidth / 2, footerY + 5, { align: "center" });
  doc.text("Merci pour votre confiance !", pageWidth / 2, footerY + 12, { align: "center" });

  // Download
  doc.save(`facture-${data.orderNumber}.pdf`);
}
