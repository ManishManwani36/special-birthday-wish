import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MessageCardProps = {
  sender: string
  subject: string
  preview: string
  timestamp: string
  isRead: boolean
  className?: string
}

export function MessageCard({ sender, subject, preview, timestamp, isRead, className }: MessageCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className={cn("font-semibold text-lg", !isRead && "font-bold")}>{sender}</h3>
          <span className="text-sm text-gray-500">{timestamp}</span>
        </div>
        <h4 className={cn("font-medium mb-2", !isRead && "font-semibold")}>{subject}</h4>
        <p className="text-gray-600 line-clamp-3">{preview}</p>
      </CardContent>
    </Card>
  )
}
