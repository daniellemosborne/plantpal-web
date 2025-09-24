import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["KERAS_BACKEND"] = "tensorflow"

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True  # tolerate some odd files
import tensorflow as tf
import pathlib, requests

from keras.models import load_model
from keras.applications.resnet import preprocess_input

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024  # 8MB uploads

# CORS: set FRONTEND_URL to your Vercel origin in Cloud Run env
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
CORS(app, resources={r"/*": {"origins": FRONTEND_URL}})

print("Running as:", __name__)
print("TF:", tf.__version__)

LOW_CONFIDENCE_THRESHOLD = float(os.getenv("PLANT_CONF_THRESH", "0.45"))

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "plant_classification_model.keras")
MODEL_URL = os.getenv("MODEL_URL", "")  # set in Cloud Run env

def ensure_model_file():
    p = pathlib.Path(MODEL_PATH)
    if p.exists():
        return
    p.parent.mkdir(parents=True, exist_ok=True)
    if not MODEL_URL:
        raise RuntimeError("MODEL_URL not set and model file missing")
    with requests.get(MODEL_URL, stream=True, timeout=300) as r:
        r.raise_for_status()
        with open(p, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

ensure_model_file()

# --- load model once ---
try:
    model = load_model(MODEL_PATH, compile=False)
    print("Loaded model:", MODEL_PATH)
    # warm-up (improves first-request latency)
    _ = model.predict(np.zeros((1, 224, 224, 3), dtype=np.float32), verbose=0)
except Exception as e:
    print("Error loading model:", e)
    raise

class_labels = [
    "Aloe Vera","Banana","Bilimbi","Cantaloupe","Cassava","Coconut",
    "Corn","Cucumber","Curcuma","Eggplant","Galangal","Ginger","Guava",
    "Kale","Longbeans","Mango","Melon","Orange","Paddy","Papaya",
    "Chili Pepper","Pineapple","Pomelo","Shallot","Soybeans","Spinach",
    "Sweet Potatoes","Tobacco","Water Apple","Watermelon"
]

@app.route("/health")
def health():
    return jsonify({"ok": True})

@app.route("/predict", methods=["POST"])
def predict():
    # basic content-type guard
    if not request.files or "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files["image"]
    if not (file and file.mimetype and file.mimetype.startswith("image/")):
        return jsonify({"error": "Unsupported file type"}), 415

    try:
        img = Image.open(file.stream).convert("RGB").resize((224, 224))
        x = np.expand_dims(np.array(img), 0).astype(np.float32)
        x = preprocess_input(x)  # ResNet (caffe) preprocessing

        logits = model.predict(x, verbose=0)[0]          # shape [C]
        probs = tf.nn.softmax(logits).numpy()            # [C]
        idx = int(np.argmax(probs))
        conf = float(probs[idx])

        top_idx = np.argsort(probs)[::-1][:3]
        candidates = [{"class": class_labels[i], "prob": float(probs[i])} for i in top_idx]

        if conf < LOW_CONFIDENCE_THRESHOLD:
            return jsonify({
                "predicted_class": "Unknown",
                "confidence": conf,
                "unknown": True,
                "candidates": candidates,
            })

        return jsonify({
            "predicted_class": class_labels[idx],
            "confidence": conf,
            "unknown": False,
            "candidates": candidates,
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {e}"}), 500

