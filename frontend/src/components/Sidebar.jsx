import {
  LayoutDashboard,
  ScanSearch,
  Video,
  AlertTriangle,
  BarChart3,
  History,
  Settings,
  ShieldCheck,
} from "lucide-react"

export default function Sidebar({ page, setPage }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analyzer", label: "AI Analyzer", icon: ScanSearch },
    { id: "live", label: "Live Monitor", icon: Video },
    { id: "violations", label: "Violations", icon: AlertTriangle },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 bg-[#071525] text-white">

      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="border-b border-slate-800 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h1 className="font-bold tracking-tight">
                AI Worker Safety
              </h1>

              <p className="text-[10px] text-slate-400">
                PPE Monitoring Platform
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">

          {items.map((item) => {

            const Icon = item.icon
            const active = page === item.id

            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}

        </nav>

        {/* Model status */}
        <div className="p-4">

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <p className="text-[10px] font-semibold text-slate-500">
              AI MODEL
            </p>

            <p className="mt-1 text-sm font-semibold">
              YOLO11s
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs text-emerald-400">
                Model Active
              </span>

            </div>

          </div>

        </div>

      </div>

    </aside>
  )
}