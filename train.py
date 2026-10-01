from ultralytics import YOLO

# Load pretrained YOLO11 Small model
model = YOLO("yolo11s.pt")

# Train on Construction-PPE
results = model.train(
    data="data.yaml",
    epochs=5,
    imgsz=640,
    batch=4,
    project="runs",
    name="worker_safety"
)

print("Training completed!")
print("Best model: runs/worker_safety/weights/best.pt")