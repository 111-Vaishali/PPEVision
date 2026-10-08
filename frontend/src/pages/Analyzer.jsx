import { useState } from "react"
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Loader2,
} from "lucide-react"

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const SAMPLE_IMAGES = [
  {
    name: "Sample 1",
    path: "/samples/image122.jpeg",
  },
  {
    name: "Sample 2",
    path: "/samples/image182.jpg",
  },
  {
    name: "Sample 3",
    path: "/samples/image612.jpg",
  },
  {
    name: "Sample 4",
    path: "/samples/image1133.jpg",
  },
]

export default function Analyzer() {
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

    const handleImage = (event) => {
    const selectedFile = event.target.files[0]

    if (!selectedFile) return

    setFile(selectedFile)
    setImage(URL.createObjectURL(selectedFile))
    setResult(null)
    setError("")
  }


  const handleSampleImage = async (sample) => {
  try {
    setError("")
    setResult(null)

    const response = await fetch(sample.path)

    if (!response.ok) {
      throw new Error("Could not load sample image")
    }

    const blob = await response.blob()

    // Get the real extension from the sample path
    const extension = sample.path.split(".").pop()

    const sampleFile = new File(
      [blob],
      `${sample.name}.${extension}`,
      {
        type: blob.type,
      }
    )

    setFile(sampleFile)
    setImage(sample.path)

  } catch (err) {
    console.error(err)

    setError(
      "Could not load the selected sample image."
    )
  }
}

  const analyzeImage = async () => {
    if (!file) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const formData = new FormData()

      formData.append("file", file)

      const response = await fetch(
        `${API_URL}/analyze`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Backend analysis failed")
      }

      const data = await response.json()

      setResult(data)

    } catch (err) {
      console.error(err)

      setError(
        "Could not connect to the AI backend. Make sure FastAPI is running."
      )

    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setImage(null)
    setResult(null)
    setError("")
  }

  return (
    <div>

      {/* PAGE HEADER */}

      <div className="mb-7">

        <h1 className="text-2xl font-bold text-slate-900">
          AI Analyzer
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Upload an image and analyze worker PPE compliance using YOLO11s
        </p>

      </div>


      {/* UPLOAD + SAMPLE IMAGES */}

{!image && (

  <div className="space-y-6">

    {/* UPLOAD */}

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/40 transition hover:bg-blue-50">

        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">

          <Upload size={28} />

        </div>

        <h2 className="font-semibold text-slate-800">
          Drop an image here
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          or click to choose an image
        </p>

        <p className="mt-3 text-xs text-slate-400">
          JPG, PNG • Maximum 10MB
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />

      </label>

    </div>


    {/* SAMPLE IMAGES */}

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-4">

        <h2 className="font-semibold text-slate-800">
          Try Sample Images
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Select a sample image to test the YOLO11s PPE detection system
        </p>

      </div>


      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        {SAMPLE_IMAGES.map((sample) => (

          <button
            key={sample.path}
            onClick={() => handleSampleImage(sample)}
            className="group overflow-hidden rounded-xl border bg-slate-50 text-left transition hover:border-blue-400 hover:shadow-md"
          >

            <div className="aspect-video overflow-hidden bg-slate-100">

              <img
                src={sample.path}
                alt={sample.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />

            </div>

            <div className="p-3">

              <p className="text-sm font-semibold text-slate-700">
                {sample.name}
              </p>

              <p className="mt-1 text-xs text-blue-500">
                Click to analyze
              </p>

            </div>

          </button>

        ))}

      </div>

    </div>

  </div>

)}


      {/* IMAGE + RESULTS */}

      {image && (

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">


          {/* IMAGE PANEL */}

          <div className="xl:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  Image Preview
                </h2>

                <p className="text-xs text-slate-400">
                  {file?.name}
                </p>

              </div>


              <button
                onClick={reset}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
              >

                <RotateCcw size={14} />

                Change Image

              </button>

            </div>


            {/* IMAGE CONTAINER */}

            <div className="flex min-h-[450px] items-center justify-center overflow-hidden rounded-xl bg-slate-950 p-4">

              <DetectionOverlay
                image={image}
                detections={result?.detections || []}
              />

            </div>


            {/* ANALYZE BUTTON */}

            {!result && (

              <button
                onClick={analyzeImage}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (

                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    AI is analyzing...

                  </>

                ) : (

                  <>
                    <ShieldCheck size={18} />

                    Analyze with AI

                  </>

                )}

              </button>

            )}


            {/* ERROR */}

            {error && (

              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                {error}

              </div>

            )}

          </div>


          {/* RESULTS PANEL */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <h2 className="font-semibold">
              PPE Detection Results
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Real YOLO11s model output
            </p>


            {/* BEFORE ANALYSIS */}

            {!result && !loading && (

              <div className="mt-10 text-center">

                <ImageIcon
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 text-sm text-slate-400">
                  Click "Analyze with AI" to process this image.
                </p>

              </div>

            )}


            {/* LOADING */}

            {loading && (

              <div className="mt-10 text-center">

                <Loader2
                  size={42}
                  className="mx-auto animate-spin text-blue-500"
                />

                <p className="mt-4 text-sm font-medium text-slate-600">
                  YOLO11s is analyzing the image...
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Detecting workers and PPE
                </p>

              </div>

            )}


            {/* RESULTS */}

            {result && (

              <div className="mt-6">


                {/* STATUS */}

                <div
                  className={`rounded-xl border p-4 ${
                    result.status === "SAFE"
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    {result.status === "SAFE" ? (

                      <ShieldCheck
                        size={27}
                        className="text-emerald-600"
                      />

                    ) : (

                      <ShieldAlert
                        size={27}
                        className="text-red-600"
                      />

                    )}

                    <div>

                      <p
                        className={`font-bold ${
                          result.status === "SAFE"
                            ? "text-emerald-700"
                            : "text-red-700"
                        }`}
                      >

                        {result.status}

                      </p>

                      <p className="text-xs text-slate-500">

                        {result.status === "SAFE"
                          ? "No PPE violation detected"
                          : `${result.violations.length} violation(s) detected`}

                      </p>

                    </div>

                  </div>

                </div>


                {/* VIOLATIONS */}

                {result.violations.length > 0 && (

                  <div className="mt-5">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Violations
                    </p>

                    <div className="space-y-2">

                      {result.violations.map(
                        (violation) => (

                          <div
                            key={violation}
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                          >

                            {formatClassName(violation)}

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}


                {/* DETECTIONS */}

                <div className="mt-6">

                  <div className="mb-3 flex items-center justify-between">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Detections
                    </p>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">

                      {result.detections.length} objects

                    </span>

                  </div>


                  <div className="max-h-72 space-y-2 overflow-y-auto">

                    {result.detections.map(
                      (detection, index) => (

                        <DetectionRow
                          key={index}
                          detection={detection}
                        />

                      )
                    )}

                  </div>

                </div>


                {/* RESET */}

                <button
                  onClick={reset}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >

                  <RotateCcw size={16} />

                  Analyze Another Image

                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  )
}


/* =====================================================
   DETECTION OVERLAY
===================================================== */

function DetectionOverlay({
  image,
  detections,
}) {

  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  })

  return (

    <div className="relative inline-block max-h-[600px] max-w-full">

      <img
        src={image}
        alt="Worker"
        className="block max-h-[600px] max-w-full object-contain"
        onLoad={(event) => {

          const img = event.currentTarget

          setImageSize({
            width: img.naturalWidth,
            height: img.naturalHeight,
          })

        }}
      />


      {imageSize.width > 0 &&
        detections.map(
          (detection, index) => (

            <DetectionBox
              key={index}
              detection={detection}
              imageWidth={imageSize.width}
              imageHeight={imageSize.height}
            />

          )
        )}

    </div>

  )
}


/* =====================================================
   DETECTION BOX
===================================================== */

function DetectionBox({
  detection,
  imageWidth,
  imageHeight,
}) {

  const [
    x1,
    y1,
    x2,
    y2,
  ] = detection.box


  const left =
    (x1 / imageWidth) * 100

  const top =
    (y1 / imageHeight) * 100

  const width =
    ((x2 - x1) / imageWidth) * 100

  const height =
    ((y2 - y1) / imageHeight) * 100


  const isViolation =
    detection.class.startsWith("no_") ||
    detection.class === "none"


  const color = isViolation
    ? "#ef4444"
    : "#22c55e"


  return (

    <div
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        border: `3px solid ${color}`,
        boxSizing: "border-box",
      }}
    >

      <div
        className="absolute left-0 top-0 -translate-y-full whitespace-nowrap rounded-t-md px-2 py-1 text-xs font-bold text-white"
        style={{
          backgroundColor: color,
        }}
      >

        {formatClassName(
          detection.class
        )}

        {" "}

        {(detection.confidence * 100).toFixed(1)}%

      </div>

    </div>

  )
}

/* =====================================================
   DETECTION ROW
===================================================== */

function DetectionRow({
  detection,
}) {

  const isViolation =
    detection.class.startsWith("no_") ||
    detection.class === "none"


  return (

    <div className="flex items-center justify-between rounded-xl border p-3">

      <div className="flex items-center gap-2">

        {isViolation ? (

          <XCircle
            size={16}
            className="text-red-500"
          />

        ) : (

          <CheckCircle2
            size={16}
            className="text-emerald-500"
          />

        )}

        <span className="text-sm font-medium">

          {formatClassName(
            detection.class
          )}

        </span>

      </div>


      <span className="text-xs font-semibold text-slate-500">

        {(detection.confidence * 100).toFixed(1)}%

      </span>

    </div>

  )
}


/* =====================================================
   FORMAT CLASS NAME
===================================================== */

function formatClassName(name) {

  return name
    .replace("no_", "No ")
    .replace("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )

}