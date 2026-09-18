import requests


# ============================================================
# OPEN-METEO API
# ============================================================

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
REVERSE_GEOCODING_URL = "https://nominatim.openstreetmap.org/reverse"

# ============================================================
# GET LOCATION COORDINATES FROM CITY
# ============================================================

def get_coordinates(city):

    params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    response = requests.get(
        GEOCODING_URL,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    if not data.get("results"):
        raise ValueError(
            f"Location '{city}' was not found"
        )

    location = data["results"][0]

    return {
        "name": location["name"],
        "country": location.get("country"),
        "latitude": location["latitude"],
        "longitude": location["longitude"]
    }


# ============================================================
# WEATHER DESCRIPTION
# ============================================================

def get_weather_description(weather_code):

    weather_codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    }

    return weather_codes.get(
        weather_code,
        "Unknown weather condition"
    )


# ============================================================
# GET WEATHER FROM COORDINATES
# ============================================================

def get_weather_by_coordinates(latitude, longitude):

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "apparent_temperature,"
            "precipitation,"
            "weather_code,"
            "wind_speed_10m"
        ),
        "timezone": "auto"
    }

    response = requests.get(
        WEATHER_URL,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    weather = response.json()

    current = weather.get("current")

    if not current:
        raise ValueError(
            "Current weather data is unavailable"
        )

    city_name = get_city_from_coordinates(latitude, longitude)
    return {
        "location": city_name,
        "country": "",
        "latitude": latitude,
        "longitude": longitude,
        "temperature": current.get("temperature_2m"),
        "humidity": current.get("relative_humidity_2m"),
        "apparent_temperature": current.get(
            "apparent_temperature"
        ),
        "precipitation": current.get("precipitation"),
        "weather_code": current.get("weather_code"),
        "weather_description": get_weather_description(
            current.get("weather_code")
        ),
        "wind_speed": current.get("wind_speed_10m"),
        "timezone": weather.get("timezone")
    }

def get_city_from_coordinates(latitude, longitude):

    params = {
        "lat": latitude,
        "lon": longitude,
        "format": "json",
        "zoom": 10
    }

    headers = {
        "User-Agent": "AgriVisionAI/1.0"
    }

    response = requests.get(
        REVERSE_GEOCODING_URL,
        params=params,
        headers=headers,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    address = data.get("address", {})

    return (
        address.get("city")
        or address.get("town")
        or address.get("village")
        or address.get("municipality")
        or "Your Location"
    )

# ============================================================
# GET WEATHER FROM CITY
# ============================================================

def get_weather(city):

    location = get_coordinates(city)

    return get_weather_by_coordinates(
        location["latitude"],
        location["longitude"]
    ) | {
        "location": location["name"],
        "country": location["country"]
    }