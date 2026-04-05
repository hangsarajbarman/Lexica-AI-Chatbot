import jsPDF from "jspdf";
import { Message } from "../types/chat";

export const exportToPDF = (messages: Message[], conversationTitle: string) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  let yPosition = margin;

  // Title
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(conversationTitle, margin, yPosition);
  yPosition += 20;

  // Date
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Exported on: ${new Date().toLocaleDateString()}`,
    margin,
    yPosition
  );
  yPosition += 20;

  messages.forEach((message) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }

    // Message header
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    const sender = message.role === "user" ? "You" : "ChatGPT";
    const timestamp = message.timestamp.toLocaleTimeString();
    pdf.text(`${sender} (${timestamp})`, margin, yPosition);
    yPosition += 10;

    // Message content
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const lines = pdf.splitTextToSize(message.content, maxWidth);

    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 10; // Space between messages
  });

  // Save the PDF
  pdf.save(
    `${conversationTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`
  );
};
