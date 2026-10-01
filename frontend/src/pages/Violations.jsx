import { useState } from "react"
import { Search, Filter, AlertTriangle } from "lucide-react"

const data = [
  {
    time: "Oct 01, 10:22 AM",
    worker: "Worker #12",
    type: "No Helmet",
    camera: "Camera 01",
    confidence: "92%",
    status: "Open",
  },
  {
    time: "Oct 01, 10:18 AM",
    worker: "Worker #07",
    type: "No Gloves",
    camera: "Camera 02",
    confidence: "88%",
    status: "Open",
  },
  {
    time: "Oct 01, 10:12 AM",
    worker: "Worker #18",
    type: "No Goggles",
    camera: "Camera 01",
    confidence: "86%",
    status: "Open",
  },
  {
    time: "Oct 01, 10:05 AM",
    worker: "Worker #03",
    type: "No Boots",
    camera: "Camera 03",
    confidence: "81%",
    status: "Review",
  },
  {
    time: "Oct 01, 09:52 AM",
    worker: "Worker #09",
    type: "No Helmet",
    camera: "Camera 02",
    confidence: "95%",
    status: "Resolved",
  },
]

export default function Violations() {

  const [search, setSearch] = useState("")
  const [type, setType] = useState("All")

  const filtered = data.filter((item) => {

    const matchesSearch =
      item.worker.toLowerCase().includes(search.toLowerCase())

    const matchesType =
      type === "All" || item.type === type

    return matchesSearch && matchesType
  })

  return (
    <div>

      <div className="mb-7">

        <h1 className="text-2xl font-bold">
          Violations
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and manage detected safety violations
        </p>

      </div>


      <div className="rounded-2xl border bg-white shadow-sm">

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 border-b p-5 md:grid-cols-4">

          <div className="relative">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search worker..."
              className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
            />

          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border px-3 text-sm outline-none"
          >
            <option>All</option>
            <option>No Helmet</option>
            <option>No Gloves</option>
            <option>No Goggles</option>
            <option>No Boots</option>
          </select>

          <select className="rounded-lg border px-3 text-sm">
            <option>All Cameras</option>
            <option>Camera 01</option>
            <option>Camera 02</option>
            <option>Camera 03</option>
          </select>

          <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Filter size={16} />
            Apply Filters
          </button>

        </div>


        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-400">

              <tr>
                <th className="px-5 py-4">Date & Time</th>
                <th>Worker</th>
                <th>Violation</th>
                <th>Camera</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((item, index) => (

                <tr
                  key={index}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-5 py-4 text-slate-500">
                    {item.time}
                  </td>

                  <td className="font-medium">
                    {item.worker}
                  </td>

                  <td>

                    <span className="flex items-center gap-2 font-medium text-red-600">

                      <AlertTriangle size={15} />

                      {item.type}

                    </span>

                  </td>

                  <td>{item.camera}</td>

                  <td>{item.confidence}</td>

                  <td>

                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                      {item.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}