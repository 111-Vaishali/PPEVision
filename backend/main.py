
import os
import uuid
from pathlib import Path
import subprocess

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from detector import detect_image
from video_detector import process_video

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="AI Worker Safety API",
    description="PPEVision image and video PPE detection",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ppevision-teal.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/outputs",
    StaticFiles(directory=str(OUTPUT_DIR)),
    name="outputs",
)


@app.get("/")
def root():
    return {
        "message": "AI Worker Safety API is running",
        "model": "YOLO11s",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()

    if extension not in {".jpg", ".jpeg", ".png", ".webp", ".bmp"}:
        raise HTTPException(
            status_code=400,
            detail="Upload a JPG, JPEG, PNG, WEBP or BMP image.",
        )

    input_path = UPLOAD_DIR / f"{uuid.uuid4().hex}{extension}"

    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        input_path.write_bytes(contents)
        return detect_image(str(input_path))

    finally:
        input_path.unlink(missing_ok=True)
        await file.close()


@app.post("/analyze-video")
async def analyze_video(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()

    if extension != ".mp4":
        raise HTTPException(
            status_code=400,
            detail="Please upload an MP4 video.",
        )

    video_id = uuid.uuid4().hex
    input_path = UPLOAD_DIR / f"{video_id}.mp4"
    output_path = OUTPUT_DIR / f"{video_id}_annotated.mp4"

    try:
        # Save the upload in chunks rather than holding the whole file in memory.
        size = 0
        max_upload_size = 100 * 1024 * 1024  # 100 MB

        with input_path.open("wb") as destination:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break

                size += len(chunk)
                if size > max_upload_size:
                    raise HTTPException(
                        status_code=413,
                        detail="Video exceeds the 100 MB upload limit.",
                    )

                destination.write(chunk)

        if size == 0:
            raise HTTPException(status_code=400, detail="Uploaded video is empty.")

        summary = process_video(str(input_path), str(output_path))

        # Convert the annotated video to a browser-compatible H.264 MP4.
        browser_output_path = OUTPUT_DIR / f"{video_id}_browser.mp4"

        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i", str(output_path),
                "-c:v", "libx264",
                "-preset", "ultrafast",
                "-pix_fmt", "yuv420p",
                "-movflags", "+faststart",
                "-an",
                str(browser_output_path),
            ],
            check=True,
            capture_output=True,
            text=True,
        )

        output_path.unlink(missing_ok=True)

        summary["output_filename"] = browser_output_path.name

        return {
            "status": (
                "VIOLATION"
                if summary["violation_frames"] > 0
                else "NO_VIOLATION_DETECTED"
            ),
            "video_url": f"/outputs/{browser_output_path.name}",
            **summary,
        }

        return {
            "status": (
                "VIOLATION"
                if summary["violation_frames"] > 0
                else "NO_VIOLATION_DETECTED"
            ),
            "video_url": f"/outputs/{output_path.name}",
            **summary,
        }

    except HTTPException:
        raise
    except Exception as exc:
        output_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=500,
            detail=f"Video processing failed: {str(exc)}",
        ) from exc
    finally:
        input_path.unlink(missing_ok=True)
        await file.close()
