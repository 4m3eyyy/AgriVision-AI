import pandas as pd
import joblib

from pathlib import Path

from catboost import CatBoostRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = BASE_DIR / "data" / "market_prices.csv"
MODEL_FILE = BASE_DIR / "ml_models" / "market_price_model.cbm"

MODEL_FILE.parent.mkdir(parents=True, exist_ok=True)


# ============================================================
# LOAD DATASET
# ============================================================

print("=" * 70)
print("LOADING MARKET PRICE DATASET")
print("=" * 70)

columns = [
    "STATE",
    "District Name",
    "Market Name",
    "Commodity",
    "Variety",
    "Grade",
    "Modal_Price",
    "Price Date"
]

df = pd.read_csv(
    DATA_FILE,
    usecols=columns
)

print("\nDataset loaded successfully!")
print("Total rows:", len(df))


# ============================================================
# CLEAN COLUMN NAMES
# ============================================================

df.columns = (
    df.columns
    .str.replace("\ufeff", "", regex=False)
    .str.strip()
)


# ============================================================
# CONVERT DATA TYPES
# ============================================================

df["Price Date"] = pd.to_datetime(
    df["Price Date"],
    errors="coerce"
)

df["Modal_Price"] = pd.to_numeric(
    df["Modal_Price"],
    errors="coerce"
)


# ============================================================
# REMOVE INVALID ROWS
# ============================================================

df = df.dropna()

df = df[
    df["Modal_Price"] > 0
]

print("Rows after cleaning:", len(df))


# ============================================================
# CREATE DATE FEATURES
# ============================================================

df["Year"] = df["Price Date"].dt.year
df["Month"] = df["Price Date"].dt.month
df["Day"] = df["Price Date"].dt.day
df["DayOfWeek"] = df["Price Date"].dt.dayofweek


# ============================================================
# SORT BY DATE
# ============================================================

df = df.sort_values(
    "Price Date"
).reset_index(drop=True)


# ============================================================
# FEATURES
# ============================================================

features = [
    "STATE",
    "District Name",
    "Market Name",
    "Commodity",
    "Variety",
    "Grade",
    "Year",
    "Month",
    "Day",
    "DayOfWeek"
]

target = "Modal_Price"

X = df[features]
y = df[target]


# ============================================================
# CATEGORICAL FEATURES
# ============================================================

categorical_features = [
    "STATE",
    "District Name",
    "Market Name",
    "Commodity",
    "Variety",
    "Grade"
]


# ============================================================
# TIME-BASED TRAIN / TEST SPLIT
# ============================================================

print("\n" + "=" * 70)
print("CREATING TIME-BASED TRAIN / TEST SPLIT")
print("=" * 70)

split_index = int(len(df) * 0.80)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))

print(
    "\nTraining period:",
    df["Price Date"].iloc[0].date(),
    "to",
    df["Price Date"].iloc[split_index - 1].date()
)

print(
    "Testing period:",
    df["Price Date"].iloc[split_index].date(),
    "to",
    df["Price Date"].iloc[-1].date()
)


# ============================================================
# TRAIN CATBOOST
# ============================================================

print("\n" + "=" * 70)
print("TRAINING MARKET PRICE MODEL")
print("=" * 70)

model = CatBoostRegressor(
    iterations=500,
    depth=8,
    learning_rate=0.08,
    loss_function="RMSE",
    eval_metric="RMSE",
    random_seed=42,
    verbose=50,
    thread_count=-1
)


model.fit(
    X_train,
    y_train,
    cat_features=categorical_features,
    eval_set=(X_test, y_test),
    early_stopping_rounds=50
)


# ============================================================
# PREDICTION
# ============================================================

print("\n" + "=" * 70)
print("EVALUATING MARKET PRICE MODEL")
print("=" * 70)

predictions = model.predict(X_test)


# ============================================================
# EVALUATION METRICS
# ============================================================

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = mean_squared_error(
    y_test,
    predictions
) ** 0.5

r2 = r2_score(
    y_test,
    predictions
)


print("\nMean Absolute Error (MAE):")
print(f"₹{mae:.2f}")

print("\nRoot Mean Squared Error (RMSE):")
print(f"₹{rmse:.2f}")

print("\nR² Score:")
print(f"{r2:.4f}")


# ============================================================
# SAVE MODEL
# ============================================================

model.save_model(
    MODEL_FILE
)


print("\n" + "=" * 70)
print("MARKET PRICE MODEL SAVED SUCCESSFULLY")
print("=" * 70)

print("\nModel location:")
print(MODEL_FILE)

print("\nMarket Price Prediction ML module completed!")