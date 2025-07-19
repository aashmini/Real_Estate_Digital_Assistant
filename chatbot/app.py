from flask import Flask, request, jsonify, render_template
import json
import os
import re
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load property data
with open("data/properties.json", "r", encoding="utf-8") as f:
    properties = json.load(f)

@app.route("/")
def home():
    return "✅ Flask chatbot backend is running! Visit /chat"

@app.route("/chat")
def chat():
    return render_template("chatbot.html")

@app.route("/api/chat", methods=["POST"])
def chatbot():
    data = request.get_json()
    message = data.get("message", "").lower()

    # 🔎 Recognized filters
    cities = ["thane", "mumbai", "delhi", "bangalore", "hyderabad", "chennai"]
    types = ["apartment", "office", "retail", "warehouse"]
    features_list = ["lift", "parking", "power backup", "cafeteria", "gym", "gymnasium"]

    # Extract filters from user message
    city = next((c for c in cities if c in message), None)
    prop_type = next((t for t in types if t in message), None)
    feature = next((f for f in features_list if f in message), None)

    # Budget like "under 30" or "below 45"
    budget_match = re.search(r"(under|below)\s*(\d+)", message)
    budget = int(budget_match.group(2)) * 100000 if budget_match else None

    # Filter properties
    results = properties
    filter_applied = False

    if city:
        results = [p for p in results if city in p["location"].lower()]
        filter_applied = True
    if prop_type:
        results = [p for p in results if prop_type in p["type"].lower()]
        filter_applied = True
    if feature:
        results = [p for p in results if any(feature in f.lower() for f in p.get("features", []))]
        filter_applied = True
    if budget:
        results = [p for p in results if p["price"] <= budget]
        filter_applied = True

    # Remove unusable properties
    results = [p for p in results if p.get("name") and p["name"].lower() != "nan"]

    if filter_applied and results:
        reply = "Found matching properties:\n\n"
        for p in results[:3]:
            raw_features = p.get("features", [])
            # Show only useful features like gym, lift, garden, etc.
            filtered = [f for f in raw_features if any(k in f.lower() for k in ["gym", "lift", "parking", "garden", "club"])]
            features = ", ".join(filtered[:6]) or "None"

            reply += f"{p['name']} in {p['location']}\n"
            reply += f"₹{p['price'] // 100000}L | Type: {p['type']}\n"
            reply += f"Features: {features}\n\n"
        return jsonify({"response": reply.strip()})

    # 🔁 No direct filter match, fall back to Ollama
    sample_props = properties[:10]
    prop_summary = "\n".join([
        f"{p['name']} in {p['location']} — ₹{p['price']//100000}L, {p['type']}"
        for p in sample_props
    ])

    prompt = f"""
You are a helpful real estate assistant. Based on this property data, answer the user's question clearly.

Properties:
{prop_summary}

User: {message}
Assistant:
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama3",
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        response.raise_for_status()

        lines = response.text.strip().splitlines()
        reply_parts = []

        for line in lines:
            try:
                res_json = json.loads(line)
                if "message" in res_json and "content" in res_json["message"]:
                    reply_parts.append(res_json["message"]["content"])
            except json.JSONDecodeError:
                continue

        reply = "".join(reply_parts).strip()

        if reply:
            print("🔹 Final reply:", reply)
            return jsonify({"response": reply})
        else:
            print("⚠️ Ollama returned no usable content.")
            return jsonify({"response": "⚠️ Ollama did not return a valid message."})

    except Exception as e:
        print("🔴 Ollama ERROR:", str(e))
        return jsonify({"response": f"⚠️ Ollama failed: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)