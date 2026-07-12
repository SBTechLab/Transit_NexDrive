'use client'

import { FileText } from 'lucide-react'

export function PDFExportButton({ data }: { data: any[] }) {
  const handleExport = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('TransitOps — Fleet Report', 14, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)

    autoTable(doc, {
      startY: 35,
      head: [['Vehicle', 'Revenue', 'Fuel Cost', 'Maintenance', 'Total Cost', 'Fuel Eff. (km/L)', 'ROI (%)']],
      body: data.map(r => [
        r.name,
        `$${r.revenue.toFixed(2)}`,
        `$${r.fuel.toFixed(2)}`,
        `$${r.maintenance.toFixed(2)}`,
        `$${r.totalCost.toFixed(2)}`,
        r.fuelEfficiency > 0 ? `${r.fuelEfficiency}` : '—',
        `${r.roi}%`,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    })

    doc.save(`fleet-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <button onClick={handleExport} className="flex items-center gap-2 h-9 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-sm">
      <FileText className="h-4 w-4" /> Export PDF
    </button>
  )
}
