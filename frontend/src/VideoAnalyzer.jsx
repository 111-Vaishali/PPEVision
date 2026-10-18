
import { useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export default function VideoAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoError, setVideoError] = useState("");

  async function analyzeVideo(event) {
    event.preventDefault();

    if (!file) {
      setError("Please choose an MP4 video first.");
      return;
    }

    setLoading(true);
    setError("");
    setVideoError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/analyze-video`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Video analysis failed.");
      }

      if (!data.video_url) {
        throw new Error("Analysis finished, but no video URL was returned.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const outputUrl = result?.video_url
    ? `${API_URL}${result.video_url.startsWith("/") ? "" : "/"}${result.video_url}`
    : "";

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Video PPE Analyzer</h1>
        <p className="mt-2 text-gray-500">
          Upload an MP4 to analyze every video frame using YOLO11s.
        </p>
      </div>

      <form
        onSubmit={analyzeVideo}
        className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"
      >
        <label className="block font-medium">
          Choose MP4 video
          <input
            className="mt-2 block w-full rounded-lg border p-3"
            type="file"
            accept=".mp4,video/mp4"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setResult(null);
              setError("");
              setVideoError("");
            }}
          />
        </label>

        {file && (
          <p className="text-sm text-gray-500">
            {file.name} · {(file.size / (1024 * 1024)).toFixed(1)} MB
          </p>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing every frame..." : "Analyze Video"}
        </button>

        {loading && (
          <p className="text-sm text-amber-700">
            Processing may take several minutes. Keep this page open.
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
            {error}
          </p>
        )}
      </form>

      {result && (
        <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">Analysis Results</h2>

          <div
            className={`rounded-lg p-4 font-semibold ${
              result.violation_frames > 0
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {result.violation_frames > 0
              ? "Potential PPE violations detected"
              : "No explicit PPE violation detected"}
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Metric label="Frames processed" value={result.frames_processed} />
            <Metric label="Video FPS" value={result.fps} />
            <Metric
              label="Duration"
              value={`${result.duration_seconds} sec`}
            />
            <Metric
              label="Violation frames"
              value={result.violation_frames}
            />
          </div>

          <h3 className="font-semibold">Annotated video</h3>

          
<div className="space-y-3">
  <video
    key={outputUrl}
    controls
    playsInline
    preload="metadata"
    className="block w-full rounded-xl bg-black"
    src={outputUrl}
  >
    Your browser cannot play this video.
  </video>
  <a
    href={outputUrl}
    target="_blank"
    rel="noreferrer"
    className="inline-block rounded-lg border px-4 py-2 font-medium"
  >
    Open output video in a new tab
  </a>
</div>


          {videoError && (
            <div className="space-y-2 rounded-lg bg-amber-50 p-3 text-amber-800">
              <p>{videoError}</p>
              <a
                href={outputUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block font-semibold underline"
              >
                Open annotated video directly
              </a>
            </div>
          )}

          <a
            href={outputUrl}
            download
            className="inline-block rounded-lg border px-4 py-2 font-medium"
          >
            Download annotated video
          </a>

          <h3 className="font-semibold">Violation classes</h3>

          {Object.keys(result.violation_counts || {}).length === 0 ? (
            <p className="text-gray-500">
              No explicit violation classes detected.
            </p>
          ) : (
            <ul className="list-inside list-disc space-y-1">
              {Object.entries(result.violation_counts).map(([name, count]) => (
                <li key={name}>
                  {name}: detected in {count} frame(s)
                </li>
              ))}
            </ul>
          )}

          <h3 className="font-semibold">Violation intervals</h3>

          {result.events?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3">Start</th>
                    <th className="p-3">End</th>
                    <th className="p-3">Classes</th>
                  </tr>
                </thead>
                <tbody>
                  {result.events.map((item, index) => (
                    <tr
                      key={`${item.start_seconds}-${index}`}
                      className="border-b"
                    >
                      <td className="p-3">{item.start_time}</td>
                      <td className="p-3">{item.end_time}</td>
                      <td className="p-3">{item.classes.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              No violation intervals were recorded.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
