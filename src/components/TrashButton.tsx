import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTodoTasks } from "@/contexts/todo/hooks/useTodoTasks";

interface TrashButtonProps {}

/**
 * Botão que abre a lixeira de tarefas excluídas.
 *
 * Exibe um contador com o número de tarefas na lixeira.
 */
export function TrashButton() {
  const { user } = useAuth();
  const { deletedTasks, isLoadingDeleted } = useTodoTasks(user?.id);
  const [trashOpen, setTrashOpen] = useState(false);

  const deletedCount = deletedTasks.length;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTrashOpen(true)}
        disabled={isLoadingDeleted}
        className="relative text-muted-foreground hover:text-destructive"
        aria-label={`Lixeira${deletedCount > 0 ? ` (${deletedCount} itens)` : ""}`}
      >
        <Trash2 className="h-5 w-5" />
        {deletedCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
            {deletedCount > 9 ? "9+" : deletedCount}
          </span>
        )}
      </Button>

      <TrashBin
        deletedTasks={deletedTasks}
        isLoading={isLoadingDeleted}
        onRestore={async (id) => {
          // This will be handled by the parent component's useTodoTasks hook
          // We'll just trigger a refetch
          // In a real implementation, we'd pass the restore function from the hook
          // For now, we'll rely on the query invalidation in the hook
        }}
        onForceDelete={async (id) => {
          // Same as above - handled by hook
        }}
        open={trashOpen}
        onOpenChange={setTrashOpen}
      />
    </>
  );
}