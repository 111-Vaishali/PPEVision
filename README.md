# PPEVision 🦺

## AI-Powered Worker Safety & PPE Compliance Monitoring System

PPEVision is an AI-powered worker safety monitoring system that uses computer vision to detect Personal Protective Equipment (PPE) and identify potential safety violations. The system analyzes worker images using a trained YOLO11s object detection model and provides safety results through a modern React dashboard.

> **Note:** PPEVision is designed as an assistive safety-monitoring system and does not replace qualified safety personnel.

---

## 🚀 Features

- 🧠 AI-based PPE detection using YOLO11s
- 👷 Worker/person detection
- 🪖 Helmet detection
- 🧤 Gloves detection
- 🦺 Safety vest detection
- 🥾 Boots detection
- 🥽 Goggles detection
- ⚠️ PPE violation detection
- 📦 Bounding-box visualization
- 📊 Confidence scores for detections
- ✅ SAFE / ⚠️ VIOLATION status
- 🖼️ Image upload and analysis
- 🧪 Built-in sample images for testing
- 🌐 React frontend with FastAPI backend
- 🔌 REST API for AI inference

---

## 🎯 Problem Statement

Construction and industrial environments require workers to use appropriate Personal Protective Equipment such as helmets, gloves, safety vests, boots, and goggles.

Manual PPE monitoring can be difficult and time-consuming, especially across large work areas.

PPEVision aims to automate part of this monitoring process by using computer vision to detect PPE-related objects and identify potential safety violations.

---

## 💡 Proposed System

```text
Worker Image
     ↓
React Frontend
     ↓
FastAPI Backend
     ↓
YOLO11s Object Detection
     ↓
PPE / Violation Detection
     ↓
Safety Rule Analysis
     ↓
SAFE / VIOLATION
     ↓
Results + Bounding Boxes
```

---

## 🧠 AI Model

### YOLO11s

PPEVision uses **YOLO11s** for object detection.

YOLO11s was selected because this project is an object detection problem where the system needs to identify both the object class and its location using bounding boxes.

The model was initialized using pretrained YOLO11s weights and trained on the **Construction-PPE dataset**.

### Training Configuration

| Parameter  | Value            |
| ---------- | ---------------- |
| Model      | YOLO11s          |
| Task       | Object Detection |
| Pretrained | Yes              |
| Epochs     | 5                |
| Image Size | 640 × 640        |
| Batch Size | 4                |
| Dataset    | Construction-PPE |
| Validation | Yes              |

> The model was trained for 5 epochs due to computational and training-time constraints. The trained model demonstrates the feasibility of the proposed system, while additional training could improve detection performance.

---

## 📊 Dataset

The project uses the **Construction-PPE dataset**, which is designed for detecting PPE equipment and construction safety-related classes.

### Dataset Size

| Split      |    Images |
| ---------- | --------: |
| Training   |     1,132 |
| Validation |       143 |
| Testing    |       141 |
| **Total**  | **1,416** |

### Classes

The dataset contains 11 classes:

```text
0   helmet
1   gloves
2   vest
3   boots
4   goggles
5   none
6   Person
7   no_helmet
8   no_goggle
9   no_gloves
10  no_boots
```

The dataset uses the YOLO object-detection annotation format.

---

## 🔍 How It Works

During training, YOLO11s learns visual patterns from labeled images.

```text
Training Image + Ground Truth
             ↓
        YOLO11s Network
             ↓
       Model Prediction
             ↓
        Calculate Loss
             ↓
       Backpropagation
             ↓
       Update Weights
             ↓
        Better Model
             ↓
          Repeat
```

For a new image, the trained model predicts:

* Object class
* Bounding-box coordinates
* Confidence score

The FastAPI backend then processes these detections and determines the safety status.

---

## ⚠️ Safety Analysis

The current prototype checks for explicit PPE violation classes:

```text
no_helmet
no_goggle
no_gloves
no_boots
```

If a violation class is detected:

```text
⚠️ VIOLATION
```

If no explicit violation class is detected:

```text
✅ SAFE
```

> **Important:** SAFE means that no explicit violation class was detected by the current model and safety rules. It does not guarantee that every required PPE item is present.

---

## 📈 Model Evaluation

The trained model was evaluated using standard object-detection metrics.

### Final Validation Results

| Metric    |    Result |
| --------- | --------: |
| Precision | **80.3%** |
| Recall    | **45.5%** |
| mAP@50    | **52.0%** |
| mAP@50–95 | **25.3%** |

### Metric Explanation

**Precision** measures how many predicted detections were correct.

**Recall** measures how many actual objects were successfully detected.

**mAP@50** evaluates mean Average Precision at an IoU threshold of 0.50.

**mAP@50–95** evaluates detection performance across IoU thresholds from 0.50 to 0.95 and provides a stricter measure of localization quality.

---

## 📸 Sample Results

### ✅ SAFE Case

The system can analyze an image and display detected PPE objects with bounding boxes and confidence scores.

> Screenshot will be added here.

### ⚠️ VIOLATION Case

The system can identify explicit PPE violation classes and display the corresponding safety status.

> Screenshot will be added here.

### Detection Visualization

The dashboard displays:

* Bounding boxes around detected objects
* Detected class names
* Confidence scores
* Safety status
* Detected violations

---

## 🖥️ Application Architecture

```text
                    PPEVision
                       │
        ┌──────────────┴──────────────┐
        │                             │
 React Frontend                  FastAPI Backend
        │                             │
 Upload / Samples              Image Processing
 Dashboard                    YOLO11s Inference
        │                             │
        └──────────────┬──────────────┘
                       ↓
                Detection Results
                       ↓
                 Safety Analysis
                       ↓
                SAFE / VIOLATION
```

---

## 🛠️ Technology Stack

### Artificial Intelligence

* YOLO11s
* Ultralytics
* PyTorch

### Computer Vision

* OpenCV

### Backend

* Python
* FastAPI
* Uvicorn
* REST API

### Frontend

* React
* Vite
* Tailwind CSS
* Lucide React

### Development

* Visual Studio Code
* Git
* GitHub

---

## 📁 Project Structure

```text
PPEVision/
│
├── backend/
│   ├── main.py
│   ├── detector.py
│   └── uploads/
│
├── frontend/
│   ├── public/
│   │   ├── samples/
│   │   └── screenshots/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
│
├── images/
├── labels/
├── runs/
│   └── detect/
│       └── runs/
│           └── worker_safety-2/
│               └── weights/
│                   └── best.pt
│
├── data.yaml
├── train.py
├── detect.py
└── README.md
```

---

## ▶️ How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/111-Vaishali/PPEVision.git
cd PPEVision
```

### 2. Create Python Environment

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\activate
```

### 3. Install Python Dependencies

```powershell
pip install ultralytics opencv-python matplotlib pandas
pip install fastapi uvicorn python-multipart
```

### 4. Start the Backend

```powershell
cd backend
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 5. Start the Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔮 Future Plans

### 🎥 Real-Time CCTV Monitoring

Integrate live camera feeds to continuously monitor workers instead of analyzing only uploaded images.

### 📷 Multi-Camera Monitoring

Support multiple construction-site cameras connected to a centralized safety dashboard.

```text
Camera 1 ─┐
Camera 2 ─┤
Camera 3 ─┼──→ PPEVision Backend ──→ Dashboard
Camera 4 ─┘
```

### 👷 Worker-Level PPE Tracking

Associate detected PPE items with individual workers.

```text
Worker #01
 ├── Helmet ✓
 ├── Vest ✓
 ├── Gloves ✓
 └── Boots ✗

Status → VIOLATION
```

### 🎯 Worker Tracking

Track individual workers across video frames to monitor their PPE compliance over time.

### 🗂️ Violation History

Store safety events including:

* Violation type
* Timestamp
* Camera
* Worker ID
* Evidence image

### 🔔 Alerts & Notifications

Generate alerts when safety violations are detected.

Possible future integrations:

* Email notifications
* Dashboard alerts
* SMS notifications
* Safety control-room alerts

### 📊 Advanced Analytics

Add analytics such as:

* Daily violation statistics
* Weekly safety trends
* Most common violation
* Camera-wise violations
* Worker compliance rate

### 🧠 Improved Model Training

Future versions can use:

* More training epochs
* More diverse images
* Additional construction environments
* Better class balancing
* Improved PPE annotations

This can help improve recall and overall detection performance.

### ⚡ Edge Deployment

Explore deployment on edge computing platforms such as NVIDIA Jetson for real-time industrial monitoring.

### 🛡️ Advanced Safety Rules

Develop worker-level compliance logic instead of analyzing PPE detections independently.

---

## ⚠️ Current Limitations

* The model was trained for only 5 epochs.
* Detection performance varies between classes.
* Recall is currently lower than precision.
* Some PPE and violation classes are more difficult to detect.
* The current prototype primarily analyzes uploaded images.
* Worker-to-PPE association is not yet implemented.
* The system should be treated as an assistive safety-monitoring tool and not a replacement for qualified safety professionals.

---

## 📌 Conclusion

PPEVision demonstrates how deep-learning-based object detection can be applied to worker safety and PPE compliance monitoring.

The project combines a trained **YOLO11s model**, **FastAPI backend**, and **React dashboard** to create an end-to-end PPE monitoring prototype.

The current system demonstrates the feasibility of automated PPE detection while providing a foundation for future development involving real-time CCTV monitoring, worker tracking, violation history, alerts, analytics, improved model training, and edge deployment.

---

## 👩‍💻 Project Information

**Project Name:** PPEVision

**Full Title:** AI-Powered Worker Safety & PPE Compliance Monitoring System

**AI Model:** YOLO11s

**Dataset:** Construction-PPE

**Training:** 5 Epochs

**Backend:** FastAPI

**Frontend:** React + Vite + Tailwind CSS

**Computer Vision:** OpenCV

---

## 🔗 GitHub

[View the PPEVision Repository](https://github.com/111-Vaishali/PPEVision)

---

⭐ **PPEVision — Making Worker Safety Smarter with AI**
