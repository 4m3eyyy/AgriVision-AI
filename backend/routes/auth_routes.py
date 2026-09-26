from flask import Blueprint, request, jsonify
from services.auth_service import register_user, login_user

auth_bp = Blueprint("auth", __name__)


# ---------------- REGISTER ---------------- #

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    user, message = register_user(
        data["full_name"],
        data["email"],
        data["password"]
    )

    if user is None:
        return jsonify({
            "success": False,
            "message": message
        }), 400

    return jsonify({
        "success": True,
        "message": message,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    })


# ---------------- LOGIN ---------------- #

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    result, message = login_user(
        data["email"],
        data["password"]
    )

    if result is None:
        return jsonify({
            "success": False,
            "message": message
        }), 401

    return jsonify({
        "success": True,
        "message": message,
        "token": result["token"],
        "user": result["user"]
    })