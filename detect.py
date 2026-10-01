from ultralytics import YOLO
import cv2

# ==============================
# 1. Load trained YOLO model
# ==============================
MODEL_PATH = "runs/detect/runs/worker_safety-2/weights/best.pt"

model = YOLO(MODEL_PATH)

# ==============================
# 2. Select test image
# ==============================
IMAGE_PATH = "images/test/image787.jpg"

# ==============================
# 3. Run detection
# ==============================
results = model(IMAGE_PATH, conf=0.25)

# ==============================
# 4. Safety violation classes
# ==============================
violation_classes = {
    "no_helmet",
    "no_goggle",
    "no_gloves",
    "no_boots"
}

# ==============================
# 5. Process detection result
# ==============================
for result in results:

    # Get detected class names
    detected_classes = []

    for cls in result.boxes.cls:
        class_id = int(cls)
        class_name = model.names[class_id]
        detected_classes.append(class_name)

    # Check for violations
    violations = [
        cls for cls in detected_classes
        if cls in violation_classes
    ]

    # ==============================
    # 6. Display safety status
    # ==============================
    annotated_image = result.plot()

    if violations:
        status = "VIOLATION"
        color = (0, 0, 255)

        print("WARNING: PPE violation detected!")
        print("Violations:", ", ".join(violations))

    else:
        status = "SAFE"
        color = (0, 255, 0)

        print("Worker appears SAFE")

    # Add status to image
    cv2.putText(
        annotated_image,
        status,
        (30, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.5,
        color,
        3
    )

    # ==============================
    # 7. Show result
    # ==============================
    cv2.imshow("AI Worker Safety Monitoring", annotated_image)

    # Save result
    cv2.imwrite("safety_result.jpg", annotated_image)

    print("Result saved as: safety_result.jpg")

    cv2.waitKey(0)
    cv2.destroyAllWindows()