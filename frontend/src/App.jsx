import { useState } from "react"

import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"

import Dashboard from "./pages/Dashboard"
import Analyzer from "./pages/Analyzer"
import Violations from "./pages/Violations"
import Analytics from "./pages/Analytics"

function App() {

  const [page, setPage] = useState("dashboard")

  const renderPage = () => {

    switch (page) {

      case "dashboard":
        return <Dashboard setPage={setPage} />

      case "analyzer":
        return <Analyzer />

      case "violations":
        return <Violations />

      case "analytics":
        return <Analytics />

      case "live":
        return (
          <ComingSoon
            title="Live Monitor"
            description="Camera and video monitoring will be connected to YOLO11s in the next phase."
          />
        )

      case "history":
        return (
          <ComingSoon
            title="Detection History"
            description="Historical safety events will appear here after we connect the database."
          />
        )

      case "settings":
        return (
          <ComingSoon
            title="Settings"
            description="Model, confidence threshold and system settings will be added here."
          />
        )

      default:
        return <Dashboard setPage={setPage} />
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      <Sidebar
        page={page}
        setPage={setPage}
      />

      <div className="ml-64">

        <Topbar />

        <main className="p-8">
          {renderPage()}
        </main>

      </div>

    </div>
  )
}


function ComingSoon({ title, description }) {

  return (
    <div className="flex min-h-[70vh] items-center justify-center">

      <div className="max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          AI
        </div>

        <h1 className="text-2xl font-bold">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  )
}

export default App