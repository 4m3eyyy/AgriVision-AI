from flask import Blueprint, request, jsonify
from services.fertilizer_service import recommend_fertilizer


fertilizer_bp = Blueprint("fertilizer", __name__)


@fertilizer_bp.route("/fertilizer/recommend", methods=["POST"])
def fertilizer_recommendation():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "JSON data is required"
        }), 400

    required_fields = [
        "temperature",
        "humidity",
        "moisture",
        "soil_type",
        "crop_type",
        "nitrogen",
        "potassium",
        "phosphorous"
    ]

    # Check required fields
    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    try:

        fertilizer = recommend_fertilizer(
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["moisture"]),
            data["soil_type"],
            data["crop_type"],
            float(data["nitrogen"]),
            float(data["potassium"]),
            float(data["phosphorous"])
        )

        return jsonify({
            "success": True,
            "recommended_fertilizer": fertilizer
        })

    except ValueError:

        return jsonify({
            "success": False,
            "message": "Numeric fields must contain valid numbers"
        }), 400

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Fertilizer recommendation failed",
            "error": str(e)
        }), 500