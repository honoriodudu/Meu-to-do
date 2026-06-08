import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Code, 
  Database, 
  Play, 
  Trash2, 
  Download, 
  Upload, 
  Copy,
  Save,
  FileText,
  Table,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { showSuccess, showError } from '@/utils/toast'

const SQLEditor = () => {
  const [sqlQuery, setSqlQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedQueries, setSavedQueries] = useState<any[]>([])
  const [queryName, setQueryName] = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const [savedQueryId, setSavedQueryId] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Carregar usuário
    const currentUser = supabase.auth.getUser()
    currentUser.then(({ data }) => {
      setUser(data.user)
    })

    // Carregar queries salvos
    loadSavedQueries()
  }, [])

  const loadSavedQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_queries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setSavedQueries(data || [])
    } catch (err) {
      console.error('Error loading saved queries:', err)
    }
  }

  // SQL templates
  const templates = {
    createTask: `INSERT INTO tasks (title, description, category_id, priority, user_id, due_date)
VALUES ('Nova Tarefa', 'Descrição da tarefa', 'uuid-da-categoria', 'medium', auth.uid(), NOW());`,
    
    getTasks: `SELECT t.*, c.name as category_name, c.color as category_color
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = auth.uid()
ORDER BY t.created_at DESC;`,
    
    updateTask: `UPDATE tasks 
SET title = 'Tarefa Atualizada', is_completed = true
WHERE id = 'uuid-da-tarefa' AND user_id = auth.uid();`,
    
    createCategory: `INSERT INTO categories (name, color, user_id)
VALUES ('Trabalho', '#3B82F6', auth.uid());`,
    
    getStats: `SELECT 
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN is_completed = false THEN 1 END) as pending_tasks,
  COUNT(DISTINCT category_id) as total_categories
FROM tasks 
WHERE user_id = auth.uid();`
  }

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      showError('Por favor, digite uma consulta SQL')
      return
    }

    setLoading(true)
    setError(null)
    setResults([])

    try {
      // Usar RPC para executar SQL direto
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql: sqlQuery 
      })

      if (error) throw error
      
      if (data && data.results) {
        setResults(data.results)
        showSuccess(`Consulta executada com sucesso! ${data.results.length} registros retornados.`)
      } else {
        showSuccess('Consulta executada com sucesso!')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao executar consulta')
      showError(`Erro: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadTemplate = (template: keyof typeof templates) => {
    setSqlQuery(templates[template])
  }

  const loadSavedQuery = (query: any) => {
    setSqlQuery(query.sql_query)
    setSavedQueryId(query.id)
    setShowSaved(false)
  }

  const saveQuery = async () => {
    if (!queryName.trim()) {
      showError('Por favor, digite um nome para a consulta')
      return
    }

    try {
      if (savedQueryId) {
        // Update existing query
        const { error } = await supabase
          .from('saved_queries')
          .update({ 
            sql_query: sqlQuery,
            query_name: queryName,
            updated_at: new Date().toISOString()
          })
          .eq('id', savedQueryId)
        
        if (error) throw error
        showSuccess('Consulta atualizada com sucesso!')
      } else {
        // Create new query
        const { error } = await supabase
          .from('saved_queries')
          .insert([{
            query_name: queryName,
            sql_query: sqlQuery,
            user_id: user?.id
          }])
        
        if (error) throw error
        showSuccess('Consulta salva com sucesso!')
      }
      
      setQueryName('')
      setSavedQueryId('')
      await loadSavedQueries()
    } catch (err: any) {
      showError(`Erro ao salvar consulta: ${err.message}`)
    }
  }

  const deleteQuery = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_queries')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      showSuccess('Consulta excluída com sucesso!')
      await loadSavedQueries()
    } catch (err: any) {
      showError(`Erro ao excluir consulta: ${err.message}`)
    }
  }

  const clearResults = () => {
    setResults([])
    setSqlQuery('')
    setError(null)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery)
    showSuccess('SQL copiado para o clipboard!')
  }

  const downloadResults = () => {
    if (results.length === 0) {
      showError('Nenhum resultado para exportar')
      return
    }

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

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma or quote
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ]
    
    return csvRows.join('\n')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Code className="h-8 w-8" />
            SQL Editor
          </h1>
          <p className="text-muted-foreground">Execute consultas SQL diretamente no seu banco de dados</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Saved Queries */}
        {savedQueries.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Consultas Salvas
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaved(!showSaved)}
                >
                  {showSaved ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            {showSaved && (
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {savedQueries.map((query) => (
                    <div key={query.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{query.query_name}</h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => loadSavedQuery(query)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteQuery(query.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {query.sql_query.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(query.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* SQL Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Editor SQL
                </CardTitle>
                <CardDescription>
                  Escreva e execute consultas SQL no seu banco de dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Button onClick={executeQuery} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    {loading ? 'Executando...' : 'Executar'}
                  </Button>
                  <Button variant="outline" onClick={clearResults}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                  <Button variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                  {results.length > 0 && (
                    <Button variant="outline" onClick={downloadResults}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar CSV
                    </Button>
                  )}
                </div>

                {/* Save Query */}
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
                  <Button variant="outline" onClick={saveQuery}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>

                {error && (
                  <div className="p-3 border border-destructive rounded-md bg-destructive/10">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            {results.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Resultados da Consulta</span>
                    <Badge variant="secondary">{results.length} registros</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
            )}
          </div>

          {/* Templates and Info */}
          <div className="space-y-6">
            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Modelos SQL
                </CardTitle>
                <CardDescription>
                  Modelos pré-definidos para operações comuns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => loadTemplate('createTask')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Nova Tarefa
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => loadTemplate('getTasks')}
                  >
                    <Table className="h-4 w-4 mr-2" />
                    Listar Tarefas
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => loadTemplate('updateTask')}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Atualizar Tarefa
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => loadTemplate('createCategory')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Categoria
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => loadTemplate('getStats')}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Estatísticas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas SQL</CardTitle>
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
          </div>
        </div>
      </main>
    </div>
  )
}

export default SQLEditor