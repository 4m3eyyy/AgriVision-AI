from flask import Blueprint, request, jsonify
from services.market_service import predict_market_price


market_bp = Blueprint("market", __name__)


@market_bp.route("/market/predict", methods=["POST"])
def market_price_prediction():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "JSON data is required"
        }), 400

    required_fields = [
        "state",
        "district",
        "market",
        "commodity",
        "variety",
        "grade",
        "year",
        "month",
        "day"
    ]

    # Check required fields
    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    try:

        year = int(data["year"])
        month = int(data["month"])
        day = int(data["day"])

        # Python weekday:
        # Monday = 0
        # Sunday = 6
        import datetime

        date_value = datetime.date(
            year,
            month,
            day
        )

        day_of_week = date_value.weekday()

        predicted_price = predict_market_price(
            data["state"],
            data["district"],
            data["market"],
            data["commodity"],
            data["variety"],
            data["grade"],
            year,
            month,
            day,
            day_of_week
        )

        return jsonify({
            "success": True,
            "commodity": data["commodity"],
            "market": data["market"],
            "predicted_modal_price": predicted_price,
            "unit": "₹/quintal"
        })

    except ValueError:

        return jsonify({
            "success": False,
            "message": "Invalid date or numeric value"
        }), 400

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Market price prediction failed",
            "error": str(e)
        }), 500