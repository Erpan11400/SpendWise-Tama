#!/usr/bin/env python3
import sys
import json
import os
import tensorflow as tf
import joblib
import numpy as np

try:
    model_path = os.path.join(os.path.dirname(__file__), 'model_production.keras')
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.joblib')
    
    print(f"Loading model from {model_path}...", file=sys.stderr)
    model = tf.keras.models.load_model(model_path)
    
    print(f"Loading scaler from {scaler_path}...", file=sys.stderr)
    scaler = joblib.load(scaler_path)
    
    # Read input from stdin (JSON format)
    input_data = json.load(sys.stdin)
    
    # Expected input: { "features": [list of numeric values] }
    features = np.array(input_data['features']).reshape(1, -1)
    
    # Scale features using the scaler
    features_scaled = scaler.transform(features)
    
    # Make prediction
    prediction = model.predict(features_scaled, verbose=0)
    
    # Output result as JSON to stdout
    result = {
        'success': True,
        'prediction': float(prediction[0][0]) if len(prediction[0]) == 1 else [float(x) for x in prediction[0]],
        'confidence': 0.85  # Model confidence (could be extracted from model if available)
    }
    
    print(json.dumps(result))

except Exception as e:
    result = {
        'success': False,
        'error': str(e)
    }
    print(json.dumps(result))
    sys.exit(1)
