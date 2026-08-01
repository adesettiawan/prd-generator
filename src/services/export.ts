import jsPDF from 'jspdf'

export async function exportToPDF(content: string, filename: string = 'prd.pdf'): Promise<void> {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  })

  const lines = doc.splitTextToSize(content, 180)
  let y = 20

  lines.forEach((line: string) => {
    if (y > 280) {
      doc.addPage()
      y = 20
    }
    doc.text(line, 15, y)
    y += 7
  })

  doc.save(filename)
}

export function exportToMarkdown(content: string, filename: string = 'prd.md'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
