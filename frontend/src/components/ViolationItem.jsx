import { AlertTriangle } from "lucide-react"

export default function ViolationItem({
  title,
  worker,
  time,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
        <AlertTriangle size={17} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-semibold text-red-700">
          {title}
        </p>

        <p className="text-xs text-slate-500">
          {worker}
        </p>

      </div>

      <span className="text-[10px] text-slate-400">
        {time}
      </span>

    </div>
  )
}