from pathlib import Path
import pandas as pd
from catboost import CatBoostRegressor


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_FILE = BASE_DIR / "ml_models" / "market_price_model.cbm"


# ============================================================
# LOAD MODEL
# ============================================================

model = CatBoostRegressor()

model.load_model(MODEL_FILE)


# ============================================================
# MARKET PRICE PREDICTION
# ============================================================

def predict_market_price(
    state,
    district,
    market,
    commodity,
    variety,
    grade,
    year,
    month,
    day,
    day_of_week
):

    input_data = pd.DataFrame([{
        "STATE": state,
        "District Name": district,
        "Market Name": market,
        "Commodity": commodity,
        "Variety": variety,
        "Grade": grade,
        "Year": year,
        "Month": month,
        "Day": day,
        "DayOfWeek": day_of_week
    }])

    prediction = model.predict(input_data)

    predicted_price = float(prediction[0])

    # Price cannot logically be negative
    predicted_price = max(0, predicted_price)

    return round(predicted_price, 2)