import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react"

export default function Analytics() {

  return (
    <div>

      <div className="mb-7">

        <h1 className="text-2xl font-bold">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Safety performance and PPE compliance insights
        </p>

      </div>


      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <Card
          icon={<AlertTriangle />}
          title="Total Violations"
          value="47"
          color="red"
        />

        <Card
          icon={<ShieldCheck />}
          title="PPE Compliance"
          value="79.2%"
          color="green"
        />

        <Card
          icon={<TrendingUp />}
          title="Safety Improvement"
          value="+12.4%"
          color="blue"
        />

      </div>


      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Bar chart */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <BarChart3 className="text-blue-600" />

            <div>

              <h2 className="font-semibold">
                Violations by Type
              </h2>

              <p className="text-xs text-slate-400">
                Current monitoring period
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-5">

            <Bar name="No Helmet" value={80} count="14" color="bg-red-500" />
            <Bar name="No Gloves" value={60} count="9" color="bg-orange-400" />
            <Bar name="No Boots" value={42} count="6" color="bg-blue-500" />
            <Bar name="No Goggles" value={30} count="4" color="bg-purple-500" />

          </div>

        </div>


        {/* Safety trend */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="font-semibold">
            Safety Rate Trend
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Last 7 days
          </p>

          <div className="mt-8 flex h-52 items-end gap-4">

            {[58, 64, 68, 66, 73, 70, 79].map(
              (height, index) => (

                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >

                  <div className="relative flex h-40 w-full items-end">

                    <div
                      className="w-full rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                    />

                  </div>

                  <span className="text-[10px] text-slate-400">
                    Day {index + 1}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  )
}


function Card({ icon, title, value, color }) {

  const colors = {
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">

      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {value}
      </p>

    </div>
  )
}


function Bar({ name, value, count, color }) {

  return (
    <div>

      <div className="mb-2 flex justify-between text-xs">

        <span className="font-medium">
          {name}
        </span>

        <span className="text-slate-400">
          {count}
        </span>

      </div>

      <div className="h-3 rounded-full bg-slate-100">

        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  )
}