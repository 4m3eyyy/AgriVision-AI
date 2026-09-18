import pandas as pd
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = BASE_DIR / "data" / "fertilizer.csv"
MODEL_FILE = BASE_DIR / "ml_models" / "fertilizer_model.pkl"

MODEL_FILE.parent.mkdir(parents=True, exist_ok=True)


# ============================================================
# LOAD DATASET
# ============================================================

print("=" * 60)
print("LOADING FERTILIZER DATASET")
print("=" * 60)

df = pd.read_csv(DATA_FILE)

# Clean column names
df.columns = (
    df.columns
    .str.replace("\ufeff", "", regex=False)
    .str.strip()
)

print("\nDataset loaded successfully!")
print("Rows:", len(df))
print("Columns:", list(df.columns))


# ============================================================
# STANDARDIZE COLUMN NAMES
# ============================================================

# The fertilizer dataset contains:
#
# Temperature
# Humidity
# Moisture
# Soil Type
# Crop Type
# Nitrogen
# Potassium
# Phosphorous
# Fertilizer Name
#
# We rename them based on their positions so hidden spaces
# or formatting problems cannot cause a KeyError.

expected_columns = [
    "Temperature",
    "Humidity",
    "Moisture",
    "Soil Type",
    "Crop Type",
    "Nitrogen",
    "Potassium",
    "Phosphorous",
    "Fertilizer Name"
]

if len(df.columns) != 9:
    raise ValueError(
        f"Expected 9 columns, but found {len(df.columns)} columns."
    )

df.columns = expected_columns

print("\nStandardized columns:")
print(list(df.columns))


# ============================================================
# REMOVE EMPTY ROWS
# ============================================================

df = df.dropna()

print("\nRows after removing empty values:", len(df))


# ============================================================
# FEATURES AND TARGET
# ============================================================

features = [
    "Temperature",
    "Humidity",
    "Moisture",
    "Soil Type",
    "Crop Type",
    "Nitrogen",
    "Potassium",
    "Phosphorous"
]

target = "Fertilizer Name"

X = df[features]
y = df[target]


# ============================================================
# FERTILIZER CLASSES
# ============================================================

print("\n" + "=" * 60)
print("FERTILIZER CLASSES")
print("=" * 60)

fertilizers = sorted(y.unique())

for fertilizer in fertilizers:
    print("-", fertilizer)

print("\nTotal fertilizer classes:", len(fertilizers))


# ============================================================
# DATASET SPLIT
# ============================================================

print("\n" + "=" * 60)
print("SPLITTING DATASET")
print("=" * 60)

# Use stratification when every class has at least 2 samples.
class_counts = y.value_counts()

if class_counts.min() >= 2:
    stratify_value = y
else:
    stratify_value = None
    print(
        "\nWarning: Some fertilizer classes have fewer than "
        "2 samples. Stratification disabled."
    )

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=stratify_value
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# FEATURE TYPES
# ============================================================

categorical_features = [
    "Soil Type",
    "Crop Type"
]

numerical_features = [
    "Temperature",
    "Humidity",
    "Moisture",
    "Nitrogen",
    "Potassium",
    "Phosphorous"
]


# ============================================================
# PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "numerical",
            "passthrough",
            numerical_features
        )
    ]
)


# ============================================================
# RANDOM FOREST
# ============================================================

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)


# ============================================================
# COMPLETE PIPELINE
# ============================================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ============================================================
# TRAIN MODEL
# ============================================================

print("\n" + "=" * 60)
print("TRAINING FERTILIZER RECOMMENDATION MODEL")
print("=" * 60)

pipeline.fit(X_train, y_train)

print("\nModel training completed successfully!")


# ============================================================
# EVALUATE MODEL
# ============================================================

print("\n" + "=" * 60)
print("MODEL EVALUATION")
print("=" * 60)

y_pred = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nTest Accuracy:")
print(f"{accuracy * 100:.2f}%")

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        zero_division=0
    )
)


# ============================================================
# SAVE MODEL
# ============================================================

joblib.dump(
    pipeline,
    MODEL_FILE
)

print("\n" + "=" * 60)
print("MODEL SAVED SUCCESSFULLY")
print("=" * 60)

print("\nModel location:")
print(MODEL_FILE)

print("\nFertilizer Recommendation ML module is ready!")