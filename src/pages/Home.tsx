// Adicionando labels ao checkbox de conclusão
<div className="flex items-start gap-3 rounded-lg border p-4">
  <div className="flex items-center gap-2">
    <Checkbox
      checked={task.is_completed}
      onCheckedChange={() => handleToggleTask(task)}
      className="mt-1"
    />
    <span className="text-sm text-gray-600">
      {task.is_completed ? 'Concluído' : 'Pendente'}
    </span>
  </div>
  
  <div className="flex-1 min-w-0">
    <p
      className={cn(
        'font-medium',
        task.is_completed && 'line-through text-muted-foreground'
      )}
    >
      {task.title}
    </p>
    {task.description && (
      <p className="text-sm text-muted-foreground mt-1">
        {task.description}
      </p>
    )}
  </div>

  <Button
    variant="ghost"
    size="icon"
    onClick={() => handleDeleteTask(task.id)}
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</div>