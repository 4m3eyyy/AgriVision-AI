from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from database.db import db
import jwt
import datetime
from flask import current_app


# ---------------- REGISTER ---------------- #

def register_user(full_name, email, password):

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return None, "Email already registered"

    hashed_password = generate_password_hash(password)

    user = User(
        full_name=full_name,
        email=email,
        password=hashed_password,
        role="farmer"
    )

    db.session.add(user)
    db.session.commit()

    return user, "User registered successfully"


# ---------------- LOGIN ---------------- #

def login_user(email, password):

    user = User.query.filter_by(email=email).first()

    if not user:
        return None, "User not found"

    if not check_password_hash(user.password, password):
        return None, "Invalid password"

    token = jwt.encode(
        {
            "user_id": user.id,
            "email": user.email,
            "role": user.role,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }, "Login successful"