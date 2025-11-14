import html2pdf from 'html2pdf.js';

export async function exportReportToPdf() {
  const element = document.getElementById('dashboard-report');
  if (!element) {
    console.error('Report element not found');
    return;
  }

  const opt = {
    margin: 10,
    filename: 'YSO-Registration-Report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  html2pdf().set(opt).from(element).save();
}
