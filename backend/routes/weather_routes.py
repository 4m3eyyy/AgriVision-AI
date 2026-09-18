from flask import Blueprint, request, jsonify
from services.weather import get_weather, get_weather_by_coordinates


weather_bp = Blueprint("weather", __name__)


@weather_bp.route("/weather", methods=["GET"])
def weather():

    city = request.args.get("city")
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    try:

        # Use GPS coordinates when provided
        if latitude and longitude:
            weather_data = get_weather_by_coordinates(
                float(latitude),
                float(longitude)
            )

        # Otherwise use the existing city search
        elif city:
            weather_data = get_weather(city)

        else:
            return jsonify({
                "success": False,
                "message": "City or location coordinates are required"
            }), 400

        return jsonify({
            "success": True,
            "weather": weather_data
        })

    except ValueError as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 404

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Weather service failed",
            "error": str(e)
        }), 500