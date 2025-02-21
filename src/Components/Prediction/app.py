from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model and encoder
model = joblib.load('decision_tree_model.pkl')
team_encoder = joblib.load('team_encoder.pkl')

@app.route('/')
def home():
    return "Welcome to the Football Prediction API!"

@app.route('/predict-upcoming', methods=['POST'])
def predict_upcoming():
    try:
        # Get input data from the request
        data = request.get_json()
        home_team = data['home_team']
        away_team = data['away_team']
        
        # Process input data
        home_team_encoded = team_encoder.transform([home_team])[0]
        away_team_encoded = team_encoder.transform([away_team])[0]
        
        # Prepare input for prediction
        input_data = [
            home_team_encoded, away_team_encoded, 9, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2023, 0, 0, 0, 0
        ]
        input_data = np.array(input_data).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        return jsonify({"prediction": int(prediction)})

    except Exception as e:
        return jsonify({"error": f"Error in prediction: {str(e)}"}), 500

@app.route('/predict-live', methods=['POST'])
def predict_live():
    try:
        # Get input data from the request
        data = request.get_json()
        home_team = data['home_team']
        away_team = data['away_team']
        
        # Process input data
        home_team_encoded = team_encoder.transform([home_team])[0]
        away_team_encoded = team_encoder.transform([away_team])[0]
        
        # Prepare input for prediction
        input_data = [
            home_team_encoded, away_team_encoded, 10, 10, 10, 50, 50, 10, 5, 5, 3, 80, 20, 25, 15, 
            2, 0, 0, 10, 5, 5, 3, 80, 20, 25, 15, 2, 0, 0, 2023, 0, 0, 0, 0
        ]
        input_data = np.array(input_data).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        return jsonify({"prediction": int(prediction)})

    except Exception as e:
        return jsonify({"error": f"Error in prediction: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
