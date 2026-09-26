from flask import Blueprint, request, jsonify
from PIL import Image
from services.disease_service import predict_disease


disease_bp = Blueprint("disease", __name__)


@disease_bp.route("/disease/predict", methods=["POST"])
def disease_prediction():

    # Check whether an image was uploaded
    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "Image file is required"
        }), 400

    file = request.files["image"]

    # Check filename
    if file.filename == "":
        return jsonify({
            "success": False,
            "message": "No image selected"
        }), 400

    try:

        # Open uploaded image
        image = Image.open(file.stream)

        # Predict disease
        result = predict_disease(image)

        return jsonify({
            "success": True,
            "status": result["status"],
            "disease": result["disease"],
            "confidence": result["confidence"],
            "message": result["message"]
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Disease prediction failed",
            "error": str(e)
        }), 500