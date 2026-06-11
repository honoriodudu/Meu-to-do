import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { validateSQL } from "@/utils/sqlValidator";

interface SQLSavedQueriesProps {
  savedQueries: any[];
  onLoadQuery: (query: any) => void;
  onDeleteQuery: (id: string) => void;
  onToggleVisibility: () => void;
  isVisible: boolean;
}

export function SQLSavedQueries({
  savedQueries,
  onLoadQuery,
  onDeleteQuery,
  onToggleVisibility,
  isVisible,
}: SQLSavedQueriesProps) {
  if (savedQueries.length === 0) return null;

  const handleLoad = (query: any) => {
    if (!validateSQL(query.sql_query)) {
      toast.error("A consulta salva contém comandos não permitidos.");
      return;
    }
    onLoadQuery(query);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Consultas Salvas
          </span>
          <Button variant="outline" size="sm" onClick={onToggleVisibility}>
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardTitle>
        <CardDescription>Gerencie suas consultas SQL salvas</CardDescription>
      </CardHeader>
      {isVisible && (
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
                      onClick={() => handleLoad(query)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteQuery(query.id)}
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
  );
}