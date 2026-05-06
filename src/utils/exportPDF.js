import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Exports data to PDF with proper Arabic / RTL support.
 * The table is rendered off-screen via html2canvas so the browser
 * handles all Arabic shaping and bidirectional text correctly.
 *
 * @param {Object[]} exportData  - Array of row objects
 * @param {string}   title       - Heading shown at the top of the PDF
 * @param {string}   fileName    - Base file name (without .pdf)
 * @param {boolean}  [isRTL]     - true when headers/data contain Arabic
 */
export const exportToPDF = async (
  exportData,
  title,
  fileName,
  isRTL = false
) => {
  if (!exportData?.length) return;

  const keys = Object.keys(exportData[0]);
  const dir = isRTL ? "rtl" : "ltr";
  const align = isRTL ? "right" : "left";

  // ── Build off-screen HTML table ─────────────────────────────────
  const tableHtml = `
    <div style="
      width:1100px;
      padding:20px;
      font-family:Arial,sans-serif;
      background:#fff;
      direction:${dir};
      box-sizing:border-box;
    ">
      <h2 style="text-align:center;font-size:18px;margin:0 0 14px;color:#1a1a1a;">
        ${title}
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <thead>
          <tr>
            ${keys
              .map(
                (k) =>
                  `<th style="border:1px solid #aaa;background:#e8e8e8;padding:7px 10px;text-align:${align};font-weight:600;">${k}</th>`
              )
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${exportData
            .map(
              (row, ri) =>
                `<tr style="background:${ri % 2 === 0 ? "#fff" : "#f5f5f5"};">
                  ${keys
                    .map(
                      (k) =>
                        `<td style="border:1px solid #ddd;padding:6px 10px;text-align:${align};">${
                          row[k] !== null && row[k] !== undefined ? row[k] : "-"
                        }</td>`
                    )
                    .join("")}
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  // Attach off-screen
  const wrapper = document.createElement("div");
  wrapper.style.cssText =
    "position:fixed;left:-9999px;top:0;z-index:-100;";
  wrapper.innerHTML = tableHtml;
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper.firstElementChild, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const orientation = keys.length > 7 ? "landscape" : "portrait";
    const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 8;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;

    // Scale image to fit usable width
    const imgW = usableW;
    const imgH = (canvas.height / canvas.width) * imgW;
    const totalPages = Math.ceil(imgH / usableH);

    for (let p = 0; p < totalPages; p++) {
      if (p > 0) doc.addPage();
      // Shift image up so the correct slice is visible on this page
      doc.addImage(
        canvas,
        "PNG",
        margin,
        margin - p * usableH,
        imgW,
        imgH
      );
    }

    doc.save(`${fileName}_${new Date().toISOString().split("T")[0]}.pdf`);
  } finally {
    document.body.removeChild(wrapper);
  }
};
