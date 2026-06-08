import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SQLToolbar } from '@/components/SQLToolbar'
import { SQLTemplates } from '@/components/SQLTemplates'
import { SQLHelp } from '@/components/SQLHelp'
import { SQLResults } from '@/components/SQLResults'
import { SQLSavedQueries } from '@/components/SQLSavedQueries'
import { supabase } from '@/integrations/supabase/client'

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
    const currentUser = supabase.auth.getUser()
    currentUser.then(({ data }) => {
      setUser(data.user)
    })

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

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      showError('Por favor, digite uma consulta SQL')
      return
    }

    setLoading(true)
    setError(null)
    setResults([])

    try {
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

  const clearResults = () => {
    setResults([])
    setSqlQuery('')
    setError(null)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery)
    showSuccess('SQL copiado para o clipboard!')
  }

  const saveQuery = async () => {
    if (!queryName.trim()) {
      showError('Por favor, digite um nome para a consulta')
      return
    }

    try {
      if (savedQueryId) {
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

  const loadSavedQuery = (query: any) => {
    setSqlQuery(query.sql_query)
    setSavedQueryId(query.id)
    setShowSaved(false)
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

  const toggleSavedVisibility = () => {
    setShowSaved(!showSaved)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            SQL Editor
          </h1>
          <p className="text-muted-foreground">Execute consultas SQL diretamente no seu banco de dados</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SQLSavedQueries
          savedQueries={savedQueries}
          onLoadQuery={loadSavedQuery}
          onDeleteQuery={deleteQuery}
          onToggleVisibility={toggleSavedVisibility}
          isVisible={showSaved}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* SQL Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Editor SQL
                </CardTitle>
                <CardDescription>
                  Escreva e execute consultas SQL no seu banco de dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SQLToolbar
                  sqlQuery={sqlQuery}
                  setSqlQuery={setSqlQuery}
                  onExecute={executeQuery}
                  onClear={clearResults}
                  onCopy={copyToClipboard}
                  onSave={saveQuery}
                  queryName={queryName}
                  setQueryName={setQueryName}
                  error={error}
                  loading={loading}
                />
              </CardContent>
            </Card>

            {/* Results */}
            <SQLResults
              results={results}
              onExport={() => {
                const csv = convertToCSV(results)
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `sql-results-${new Date().toISOString().split('T')[0]}.csv`
                a.click()
                window.URL.revokeObjectURL(url)
                showSuccess('Resultados exportados com sucesso!')
              }}
            />
          </div>

          {/* Templates and Info */}
          <div className="space-y-6">
            <SQLTemplates onTemplateSelect={(template) => setSqlQuery(template)} />
            <SQLHelp />
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper function para exportação
function convertToCSV(data: any[]) {
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

export default SQLEditor