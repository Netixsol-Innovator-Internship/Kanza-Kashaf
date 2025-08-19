"use client"
import { Card } from "./ui/Card"
import { CheckCircle2, Circle, Target } from "lucide-react"
import type { TaskStats as TaskStatsType } from "../types/task"

interface TaskStatsProps {
  stats: TaskStatsType
}

export function TaskStats({ stats }: TaskStatsProps) {
  const { total, completed, pending } = stats

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 sm:p-6 border-border/50 hover:shadow-md transition-all duration-400">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-card-foreground">{total}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 border-border/50 hover:shadow-md transition-all duration-400">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-card-foreground">{completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 border-border/50 hover:shadow-md transition-all duration-400">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Circle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-card-foreground">{pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
