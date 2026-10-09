from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from detector import detect_image

import os
import uuid


app = FastAPI(
    title="AI Worker Safety API",
    description="Backend API for AI-based PPE detection",
    version="1.0.0",
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


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

    file_extension = os.path.splitext(file.filename)[1]

    filename = f"{uuid.uuid4()}{file_extension}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename,
    )

    contents = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    result = detect_image(file_path)

    return result