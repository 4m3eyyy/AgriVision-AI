from flask import Blueprint, request, jsonify
from services.cs import recommend_crop

crop_bp = Blueprint("crop", __name__)


@crop_bp.route("/crop/recommend", methods=["POST"])
def crop_recommendation():

    data = request.get_json()

    required_fields = [
        "N",
        "P",
        "K",
        "temperature",
        "humidity",
        "ph",
        "rainfall"
    ]

    # Check that all required fields are present
    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    try:
        crop = recommend_crop(
            float(data["N"]),
            float(data["P"]),
            float(data["K"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"])
        )

        return jsonify({
            "success": True,
            "recommended_crop": crop
        })

    except ValueError:
        return jsonify({
            "success": False,
            "message": "All input values must be numeric"
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Crop recommendation failed",
            "error": str(e)
        }), 500