import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
