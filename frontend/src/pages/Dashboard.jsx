import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Camera,
  ArrowUpRight,
} from "lucide-react"

import StatCard from "../components/StatCard"
import ViolationItem from "../components/ViolationItem"

export default function Dashboard({ setPage }) {

  return (
    <div>

      {/* Page title */}
      <div className="mb-7">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Safety Overview
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Real-time PPE compliance monitoring for your construction site
            </p>

          </div>

          <div className="rounded-lg border bg-white px-4 py-2 text-xs text-slate-500">
            October 01, 2026
          </div>

        </div>

      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Workers"
          value="24"
          subtitle="+12% from yesterday"
          icon={<Users size={22} />}
          color="blue"
        />

        <StatCard
          title="Safe Workers"
          value="19"
          subtitle="+8% from yesterday"
          icon={<ShieldCheck size={22} />}
          color="green"
        />

        <StatCard
          title="Violations"
          value="5"
          subtitle="Requires attention"
          icon={<ShieldAlert size={22} />}
          color="red"
        />

        <StatCard
          title="Safety Rate"
          value="79.2%"
          subtitle="+6% from yesterday"
          icon={<Activity size={22} />}
          color="purple"
        />

      </div>


      {/* Camera + Alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Camera */}
        <div className="xl:col-span-2 rounded-2xl border bg-white shadow-sm">

          <div className="flex items-center justify-between border-b px-5 py-4">

            <div>
              <h2 className="font-semibold text-slate-900">
                Live Camera Feed
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Camera 01 • Construction Zone
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">

              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-emerald-600">
                LIVE
              </span>

            </div>

          </div>

          <div className="p-5">

            <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-950">

              <Camera size={55} className="text-slate-600" />

              <div className="absolute left-4 top-4 rounded-lg bg-black/60 px-3 py-2 text-xs text-white">
                AI Detection Active
              </div>

              <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-2 text-xs text-white">
                Camera 01
              </div>

            </div>

            <button
              onClick={() => setPage("analyzer")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Analyze an Image
              <ArrowUpRight size={17} />
            </button>

          </div>

        </div>


        {/* Alerts */}
        <div className="rounded-2xl border bg-white shadow-sm">

          <div className="flex items-center justify-between border-b px-5 py-4">

            <div>
              <h2 className="font-semibold">
                Recent Violations
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Latest safety alerts
              </p>
            </div>

            <button
              onClick={() => setPage("violations")}
              className="text-xs font-semibold text-blue-600"
            >
              View all
            </button>

          </div>

          <div className="space-y-3 p-4">

            <ViolationItem
              title="No Helmet"
              worker="Worker #12"
              time="2 min"
            />

            <ViolationItem
              title="No Gloves"
              worker="Worker #07"
              time="5 min"
            />

            <ViolationItem
              title="No Goggles"
              worker="Worker #18"
              time="9 min"
            />

            <ViolationItem
              title="No Boots"
              worker="Worker #03"
              time="14 min"
            />

          </div>

        </div>

      </div>


      {/* Quick Filters */}
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="font-semibold">
            Quick Detection Filters
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Select the PPE categories you want to monitor
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          {["Helmet", "Gloves", "Vest", "Boots", "Goggles"].map(
            (item) => (
              <button
                key={item}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
              >
                {item}
              </button>
            )
          )}

        </div>

      </div>

    </div>
  )
}