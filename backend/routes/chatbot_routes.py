from flask import Blueprint, request, jsonify
from chatbot.gs import ask_gemini

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    message = data.get("message")

    if not message:
        return jsonify({
            "success": False,
            "message": "Message is required"
        }), 400

    try:
        response = ask_gemini(message)

        return jsonify({
            "success": True,
            "response": response
        })

    except Exception as e:
        print("GEMINI ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": "Gemini request failed",
            "error": str(e)
        }), 500