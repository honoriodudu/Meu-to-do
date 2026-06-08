import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"

export function SQLHelp() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Dicas SQL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">Funções Úteis:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <code className="bg-background px-1 rounded">auth.uid()</code> - ID do usuário atual</li>
              <li>• <code className="bg-background px-1 rounded">NOW()</code> - Timestamp atual</li>
              <li>• <code className="bg-background px-1 rounded">uuid_generate_v4()</code> - UUID aleatório</li>
            </ul>
          </div>
          
          <div className="p-3 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">Segurança:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sempre filtre por <code className="bg-background px-1 rounded">user_id</code></li>
              <li>• Use <code className="bg-background px-1 rounded">auth.uid()</code> para isolamento</li>
              <li>• Nunca use <code className="bg-background px-1 rounded">true</code> sem WHERE</li>
            </ul>
          </div>

          <div className="p-3 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">Limites:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Máximo: 1000 registros por consulta</li>
              <li>• Timeout: 30 segundos</li>
              <li>• Apenas SELECT, INSERT, UPDATE, DELETE</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}