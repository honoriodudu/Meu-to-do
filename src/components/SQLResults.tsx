import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Table } from "lucide-react"
import { showSuccess, showError } from "@/utils/toast"

interface SQLResultsProps {
  results: any[]
  onExport: () => void
}

export function SQLResults({ results, onExport }: SQLResultsProps) {
  if (results.length === 0) return null

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ]
    
    return csvRows.join('\n')
  }

  const downloadResults = () => {
    const csv = convertToCSV(results)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sql-results-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    showSuccess('Resultados exportados com sucesso!')
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Resultados da Consulta
          </span>
          <Badge variant="secondary">{results.length} registros</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button variant="outline" onClick={downloadResults}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                {Object.keys(results[0]).map((key) => (
                  <th key={key} className="text-left p-2 font-medium text-sm">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex} className="p-2 text-sm">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}