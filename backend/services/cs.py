import joblib
import pandas as pd
from pathlib import Path


# Locate the trained model
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_FILE = BASE_DIR / "ml_models" / "crop_recommendation_model.pkl"


# Load the model once when the application starts
model = joblib.load(MODEL_FILE)


def recommend_crop(N, P, K, temperature, humidity, ph, rainfall):

    input_data = pd.DataFrame([{
        "N": N,
        "P": P,
        "K": K,
        "temperature": temperature,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall
    }])

    prediction = model.predict(input_data)

    return prediction[0]