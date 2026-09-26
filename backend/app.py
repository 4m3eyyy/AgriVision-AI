from flask import Flask
from flask_cors import CORS
from config import Config
from database.db import db

from models.user import User
from routes.auth_routes import auth_bp
from routes.chatbot_routes import chatbot_bp
from routes.crop_routes import crop_bp
from routes.disease_routes import disease_bp
from routes.fertilizer_routes import fertilizer_bp
from routes.weather_routes import weather_bp
from routes.market_routes import market_bp
app = Flask(__name__)
CORS(app)

app.config.from_object(Config)

db.init_app(app)



with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(chatbot_bp, url_prefix="/api")
app.register_blueprint(crop_bp, url_prefix="/api")
app.register_blueprint(disease_bp, url_prefix="/api")
app.register_blueprint(fertilizer_bp, url_prefix="/api")
app.register_blueprint(weather_bp, url_prefix="/api")
app.register_blueprint(market_bp, url_prefix="/api")
@app.route("/")
def home():
    return {
        "project": "AgriVision AI",
        "version": "1.0",
        "status": "Backend Running"
    }


@app.route("/health")
def health():
    try:
        with app.app_context():
            db.session.execute(db.text("SELECT 1"))

        database = "Connected"

    except Exception as e:
        database = f"Disconnected ({e})"

    return {
        "database": database,
        "api": "Running"
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)