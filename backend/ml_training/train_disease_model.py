import tensorflow as tf
from datasets import load_dataset
import numpy as np
import json
from pathlib import Path


# ============================================================
# PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "ml_models"
MODEL_DIR.mkdir(exist_ok=True)

MODEL_FILE = MODEL_DIR / "plant_disease_model.keras"
CLASS_FILE = MODEL_DIR / "disease_classes.json"


# ============================================================
# SETTINGS
# ============================================================

IMAGE_SIZE = (160, 160)
BATCH_SIZE = 32
EPOCHS = 3
SEED = 42


# ============================================================
# LOAD PLANTVILLAGE DATASET
# ============================================================

print("=" * 60)
print("LOADING PLANTVILLAGE DATASET")
print("=" * 60)

dataset = load_dataset(
    "geraldmc/plantvillage-full",
    "default"
)

data = dataset["train"]

print("\nDataset loaded successfully!")
print(f"Total images: {len(data)}")


# ============================================================
# GET CLASS NAMES
# ============================================================

class_names = sorted(
    data.unique("class_label")
)

num_classes = len(class_names)

print(f"\nNumber of disease classes: {num_classes}")

print("\nDisease classes:")

for i, name in enumerate(class_names):
    print(f"{i}: {name}")


# ============================================================
# CREATE CLASS MAPPING
# ============================================================

class_to_index = {
    name: index
    for index, name in enumerate(class_names)
}


# ============================================================
# SAVE CLASS NAMES
# ============================================================

with open(CLASS_FILE, "w", encoding="utf-8") as file:
    json.dump(class_names, file, indent=4)

print("\nClass names saved to:")
print(CLASS_FILE)


# ============================================================
# FILTER TRAIN / TEST
# ============================================================

train_data = data.filter(
    lambda x: x["split"] == "train"
)

test_data = data.filter(
    lambda x: x["split"] == "test"
)

print("\nDataset split:")
print(f"Training images: {len(train_data)}")
print(f"Testing images: {len(test_data)}")


# ============================================================
# IMAGE PROCESSING
# ============================================================

def process_image(image):

    image = image.convert("RGB")

    image = image.resize(IMAGE_SIZE)

    image = np.array(
        image,
        dtype=np.float32
    )

    return image


# ============================================================
# TRAINING GENERATOR
# ============================================================

def train_generator():

    for item in train_data:

        image = process_image(
            item["image"]
        )

        label = class_to_index[
            item["class_label"]
        ]

        yield image, label


# ============================================================
# TESTING GENERATOR
# ============================================================

def test_generator():

    for item in test_data:

        image = process_image(
            item["image"]
        )

        label = class_to_index[
            item["class_label"]
        ]

        yield image, label


# ============================================================
# TENSORFLOW DATASET
# ============================================================

output_signature = (
    tf.TensorSpec(
        shape=(160, 160, 3),
        dtype=tf.float32
    ),

    tf.TensorSpec(
        shape=(),
        dtype=tf.int32
    )
)


training_dataset = tf.data.Dataset.from_generator(
    train_generator,
    output_signature=output_signature
)


testing_dataset = tf.data.Dataset.from_generator(
    test_generator,
    output_signature=output_signature
)


# ============================================================
# SHUFFLE / BATCH / PREFETCH
# ============================================================

training_dataset = training_dataset.shuffle(
    buffer_size=5000,
    seed=SEED
)

training_dataset = training_dataset.batch(
    BATCH_SIZE
)

testing_dataset = testing_dataset.batch(
    BATCH_SIZE
)


training_dataset = training_dataset.prefetch(
    tf.data.AUTOTUNE
)

testing_dataset = testing_dataset.prefetch(
    tf.data.AUTOTUNE
)


# ============================================================
# DATA AUGMENTATION
# ============================================================

data_augmentation = tf.keras.Sequential([

    tf.keras.layers.RandomFlip(
        "horizontal"
    ),

    tf.keras.layers.RandomRotation(
        0.1
    ),

    tf.keras.layers.RandomZoom(
        0.1
    )
])


# ============================================================
# LOAD MOBILENETV2
# ============================================================

print("\n" + "=" * 60)
print("LOADING MOBILENETV2")
print("=" * 60)

base_model = tf.keras.applications.MobileNetV2(

    input_shape=(160, 160, 3),

    include_top=False,

    weights="imagenet"
)


# Freeze pretrained layers

base_model.trainable = False


# ============================================================
# BUILD MODEL
# ============================================================

inputs = tf.keras.Input(
    shape=(160, 160, 3)
)


x = data_augmentation(inputs)


x = tf.keras.applications.mobilenet_v2.preprocess_input(
    x
)


x = base_model(
    x,
    training=False
)


x = tf.keras.layers.GlobalAveragePooling2D()(
    x
)


x = tf.keras.layers.Dropout(
    0.2
)(
    x
)


outputs = tf.keras.layers.Dense(
    num_classes,
    activation="softmax"
)(
    x
)


model = tf.keras.Model(
    inputs,
    outputs
)


# ============================================================
# COMPILE
# ============================================================

model.compile(

    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),

    loss="sparse_categorical_crossentropy",

    metrics=["accuracy"]
)


# ============================================================
# MODEL SUMMARY
# ============================================================

model.summary()


# ============================================================
# TRAIN
# ============================================================

print("\n" + "=" * 60)
print("STARTING DISEASE MODEL TRAINING")
print("=" * 60)

history = model.fit(

    training_dataset,

    epochs=EPOCHS

)


# ============================================================
# EVALUATE
# ============================================================

print("\n" + "=" * 60)
print("EVALUATING MODEL")
print("=" * 60)

test_loss, test_accuracy = model.evaluate(
    testing_dataset
)


# ============================================================
# SAVE MODEL
# ============================================================

model.save(
    MODEL_FILE
)


# ============================================================
# RESULTS
# ============================================================

print("\n" + "=" * 60)
print("DISEASE MODEL TRAINING COMPLETE")
print("=" * 60)

print("\nModel saved to:")
print(MODEL_FILE)

print("\nClass names saved to:")
print(CLASS_FILE)

print(
    f"\nTest Accuracy: "
    f"{test_accuracy * 100:.2f}%"
)