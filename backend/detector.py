
from ultralytics import YOLO
import os
import cv2
import gc

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best.pt")

model = YOLO(MODEL_PATH)

VIOLATION_CLASSES = {
    "no_helmet",
    "no_goggle",
    "no_gloves",
    "no_boots",
    "none",
}

def detect_image(image_path):
    print("AI ANALYSIS STARTED", flush=True)

    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found: {image_path}")

    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not read image: {image_path}")

    # Keep uploaded images small to reduce inference memory.
    max_size = 640
    height, width = image.shape[:2]

    if max(height, width) > max_size:
        scale = max_size / max(height, width)
        image = cv2.resize(
            image,
            (int(width * scale), int(height * scale)),
        )

    print("Running YOLO inference", flush=True)

    try:
        with __import__("torch").inference_mode():
            results = model.predict(
                source=image,
                imgsz=416,
                conf=0.25,
                device="cpu",
                verbose=False,
                stream=False,
            )

            detections = []
            violations = set()

            for result in results:
                for box in result.boxes:
                    class_id = int(box.cls[0])
                    class_name = model.names[class_id]
                    confidence = float(box.conf[0])
                    coordinates = box.xyxy[0].tolist()

                    detections.append({
                        "class": class_name,
                        "confidence": round(confidence, 3),
                        "box": [round(v, 2) for v in coordinates],
                    })

                    if class_name in VIOLATION_CLASSES:
                        violations.add(class_name)

            status = "VIOLATION" if violations else "SAFE"

            print("YOLO inference completed", flush=True)

            return {
                "status": status,
                "violations": sorted(violations),
                "detections": detections,
            }

    finally:
        gc.collect()