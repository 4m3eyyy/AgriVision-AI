import json
import numpy as np
import tensorflow as tf
from PIL import Image
from pathlib import Path


# ============================================================
# PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_FILE = BASE_DIR / "ml_models" / "plant_disease_model.keras"
CLASS_FILE = BASE_DIR / "ml_models" / "disease_classes.json"


# ============================================================
# CONFIDENCE THRESHOLD
# ============================================================

CONFIDENCE_THRESHOLD = 0.70


# ============================================================
# LOAD DISEASE CLASSES
# ============================================================

with open(CLASS_FILE, "r", encoding="utf-8") as file:
    class_names = json.load(file)


# ============================================================
# MODEL
# ============================================================

model = None


def get_model():

    global model

    if model is None:
        model = tf.keras.models.load_model(MODEL_FILE)

    return model


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

def preprocess_image(image):

    image = image.convert("RGB")
    image = image.resize((160, 160))

    image = np.array(
        image,
        dtype=np.float32
    )

    image = np.expand_dims(
        image,
        axis=0
    )

    return image


# ============================================================
# DISEASE PREDICTION
# ============================================================

def predict_disease(image):

    disease_model = get_model()

    processed_image = preprocess_image(image)

    predictions = disease_model.predict(
        processed_image,
        verbose=0
    )

    predicted_index = int(
        np.argmax(predictions[0])
    )

    confidence = float(
        predictions[0][predicted_index]
    )

    disease = class_names[predicted_index]

    confidence_percentage = round(
        confidence * 100,
        2
    )

    # ========================================================
    # CONFIDENCE CHECK
    # ========================================================

    if confidence < CONFIDENCE_THRESHOLD:

        return {
            "status": "low_confidence",
            "disease": None,
            "confidence": confidence_percentage,
            "message": (
                "Unable to confidently identify the plant disease. "
                "Please upload a clear close-up image of the affected leaf."
            )
        }

    # ========================================================
    # CONFIDENT PREDICTION
    # ========================================================

    return {
        "status": "identified",
        "disease": disease,
        "confidence": confidence_percentage,
        "message": "Disease identified successfully."
    }