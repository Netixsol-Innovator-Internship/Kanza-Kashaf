import type React from "react"

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-primary/20"></div>
        </div>
        <p className="text-muted-foreground font-medium">Loading your tasks...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
