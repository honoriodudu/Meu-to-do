import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Play, Trash2, Copy, Save } from "lucide-react"
import { showSuccess, showError } from "@/utils/toast"

interface SQLToolbarProps {
  sqlQuery: string
  setSqlQuery: (query: string) => void
  onExecute: () => void
  onClear: () => void
  onCopy: () => void
  onSave: () => void
  queryName: string
  setQueryName: (name: string) => void
  error: string | null
  loading: boolean
}

export function SQLToolbar({
  sqlQuery,
  setSqlQuery,
  onExecute,
  onClear,
  onCopy,
  onSave,
  queryName,
  setQueryName,
  error,
  loading
}: SQLToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sql-query">Consulta SQL</Label>
        <Textarea
          id="sql-query"
          placeholder="SELECT * FROM tasks WHERE user_id = auth.uid();"
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button onClick={onExecute} disabled={loading}>
          <Play className="h-4 w-4 mr-2" />
          {loading ? 'Executando...' : 'Executar'}
        </Button>
        <Button variant="outline" onClick={onClear}>
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar
        </Button>
        <Button variant="outline" onClick={onCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copiar
        </Button>
        <Button variant="outline" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor="query-name">Nome da Consulta (opcional)</Label>
          <Input
            id="query-name"
            placeholder="Meu Relatório"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 border border-destructive rounded-md bg-destructive/10">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}