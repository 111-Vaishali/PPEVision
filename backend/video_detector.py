
import os
import gc
import cv2
import torch
from datetime import timedelta

from detector import model, VIOLATION_CLASSES


def process_video(input_path, output_path):
    if not os.path.isfile(input_path):
        raise FileNotFoundError(f"Video not found: {input_path}")

    capture = cv2.VideoCapture(input_path)

    if not capture.isOpened():
        raise ValueError("Could not open the uploaded video.")

    fps = capture.get(cv2.CAP_PROP_FPS)
    if not fps or fps <= 0:
        fps = 25.0

    total_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))

    writer = None
    frame_index = 0
    violation_frames = 0
    violation_counts = {}
    events = []

    active_classes = ()
    active_start = None

    try:
        while True:
            success, frame = capture.read()

            if not success:
                break

            # Resize large frames to reduce CPU and memory usage.
            height, width = frame.shape[:2]
            max_size = 640

            if max(height, width) > max_size:
                scale = max_size / max(height, width)
                new_width = max(1, int(width * scale))
                new_height = max(1, int(height * scale))
                frame = cv2.resize(frame, (new_width, new_height))

            height, width = frame.shape[:2]

            # Create the output video writer once.
            if writer is None:
                os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
                fourcc = cv2.VideoWriter_fourcc(*"mp4v")
                writer = cv2.VideoWriter(
                    output_path,
                    fourcc,
                    fps,
                    (width, height),
                )

                if not writer.isOpened():
                    raise RuntimeError("Could not create the annotated video.")

            # Run YOLO inference.
            with torch.inference_mode():
                results = model.predict(
                    source=frame,
                    imgsz=416,
                    conf=0.25,
                    device="cpu",
                    verbose=False,
                )

            result = results[0]
            frame_classes = set()

            # First collect the violations detected in this frame.
            for box in result.boxes:
                class_id = int(box.cls[0])
                class_name = result.names[class_id]

                if class_name in VIOLATION_CLASSES:
                    frame_classes.add(class_name)
                    violation_counts[class_name] = (
                        violation_counts.get(class_name, 0) + 1
                    )

            # Draw custom bounding boxes and labels.
            annotated_frame = frame.copy()

            for box in result.boxes:
                class_id = int(box.cls[0])
                class_name = result.names[class_id]
                confidence = float(box.conf[0])

                x1, y1, x2, y2 = map(
                    int, box.xyxy[0].tolist()
                )

                is_violation = class_name in VIOLATION_CLASSES

                # OpenCV uses BGR colors: red for violations, green otherwise.
                color = (0, 0, 255) if is_violation else (0, 200, 0)

                label = f"{class_name} {confidence:.0%}"

                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = 0.55
                thickness = 2

                (text_width, text_height), baseline = cv2.getTextSize(
                    label, font, font_scale, thickness
                )

                label_y = max(y1, text_height + 10)

                # Bounding box.
                cv2.rectangle(
                    annotated_frame,
                    (x1, y1),
                    (x2, y2),
                    color,
                    2,
                )

                # Label background.
                label_top = max(0, label_y - text_height - 8)
                label_bottom = min(
                    height - 1, label_y + baseline - 4
                )
                label_right = min(
                    width - 1, x1 + text_width + 8
                )

                cv2.rectangle(
                    annotated_frame,
                    (max(0, x1), label_top),
                    (label_right, label_bottom),
                    color,
                    cv2.FILLED,
                )

                # Label text.
                cv2.putText(
                    annotated_frame,
                    label,
                    (max(0, x1 + 4), max(text_height, label_y - 5)),
                    font,
                    font_scale,
                    (255, 255, 255),
                    thickness,
                    cv2.LINE_AA,
                )

            # Track violation intervals.
            timestamp = frame_index / fps
            current_classes = tuple(sorted(frame_classes))

            if current_classes:
                violation_frames += 1

            if current_classes != active_classes:
                if active_classes and active_start is not None:
                    events.append({
                        "start_seconds": round(active_start, 2),
                        "end_seconds": round(timestamp, 2),
                        "start_time": str(
                            timedelta(seconds=int(active_start))
                        ),
                        "end_time": str(
                            timedelta(seconds=int(timestamp))
                        ),
                        "classes": list(active_classes),
                    })

                active_classes = current_classes
                active_start = timestamp if current_classes else None

            # Add a status banner.
            if frame_classes:
                status_text = "PPE VIOLATION DETECTED"
                status_color = (0, 0, 255)
            else:
                status_text = "NO EXPLICIT VIOLATION DETECTED"
                status_color = (0, 150, 0)

            cv2.rectangle(
                annotated_frame,
                (0, 0),
                (width, 40),
                status_color,
                cv2.FILLED,
            )

            cv2.putText(
                annotated_frame,
                status_text,
                (12, 27),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (255, 255, 255),
                2,
                cv2.LINE_AA,
            )

            # Write each annotated frame exactly once.
            writer.write(annotated_frame)

            frame_index += 1

            if frame_index % 100 == 0:
                print(
                    f"Processed {frame_index}/{total_frames} frames",
                    flush=True,
                )

            del results, result, annotated_frame, frame

        # Close the final violation interval, if one is active.
        if active_classes and active_start is not None:
            end_timestamp = frame_index / fps

            events.append({
                "start_seconds": round(active_start, 2),
                "end_seconds": round(end_timestamp, 2),
                "start_time": str(
                    timedelta(seconds=int(active_start))
                ),
                "end_time": str(
                    timedelta(seconds=int(end_timestamp))
                ),
                "classes": list(active_classes),
            })

        if frame_index == 0:
            raise ValueError("The uploaded video contains no readable frames.")

        return {
            "frames_processed": frame_index,
            "original_frame_count": total_frames,
            "fps": round(fps, 2),
            "duration_seconds": round(frame_index / fps, 2),
            "violation_frames": violation_frames,
            "violation_counts": violation_counts,
            "events": events,
            "output_filename": os.path.basename(output_path),
        }

    finally:
        capture.release()

        if writer is not None:
            writer.release()

        gc.collect()
