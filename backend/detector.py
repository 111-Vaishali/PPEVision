from ultralytics import YOLO


MODEL_PATH = "models/best.pt"

model = YOLO(MODEL_PATH)


VIOLATION_CLASSES = {
    "no_helmet",
    "no_goggle",
    "no_gloves",
    "no_boots",
    "none",
}


def detect_image(image_path):

    results = model(image_path, conf=0.25)

    detections = []
    violations = []

    for result in results:

        boxes = result.boxes

        for i in range(len(boxes)):

            class_id = int(boxes.cls[i])
            class_name = model.names[class_id]

            confidence = float(boxes.conf[i])

            coordinates = boxes.xyxy[i].tolist()

            detection = {
                "class": class_name,
                "confidence": round(confidence, 3),
                "box": [round(value, 2) for value in coordinates],
            }

            detections.append(detection)

            if class_name in VIOLATION_CLASSES:
                violations.append(class_name)

    if violations:
        status = "VIOLATION"
    else:
        status = "SAFE"

    return {
        "status": status,
        "violations": list(set(violations)),
        "detections": detections,
    }