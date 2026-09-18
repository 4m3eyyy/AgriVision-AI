import pandas as pd
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# --------------------------------------------------
# 1. Locate files
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = BASE_DIR / "data" / "recomendtn.csv"
MODEL_FILE = BASE_DIR / "ml_models" / "crop_recommendation_model.pkl"


# --------------------------------------------------
# 2. Load dataset
# --------------------------------------------------

print("Loading dataset...")

df = pd.read_csv(DATA_FILE)

print(f"Dataset loaded successfully!")
print(f"Rows: {len(df)}")
print(f"Columns: {list(df.columns)}")


# --------------------------------------------------
# 3. Separate features and target
# --------------------------------------------------

features = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall"
]

target = "label"

X = df[features]
y = df[target]


# --------------------------------------------------
# 4. Split dataset
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"\nTraining samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")


# --------------------------------------------------
# 5. Create Random Forest model
# --------------------------------------------------

print("\nTraining Random Forest model...")

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)


# --------------------------------------------------
# 6. Evaluate model
# --------------------------------------------------

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\n-----------------------------------")
print("MODEL EVALUATION")
print("-----------------------------------")

print(f"Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# --------------------------------------------------
# 7. Save trained model
# --------------------------------------------------

joblib.dump(model, MODEL_FILE)

print("-----------------------------------")
print("MODEL SAVED SUCCESSFULLY")
print("-----------------------------------")
print(f"Saved to: {MODEL_FILE}")