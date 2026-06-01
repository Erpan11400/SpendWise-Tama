import tensorflow as tf
import joblib

print("Loading model...")
model = tf.keras.models.load_model('c:/spendwise2/SpendWise/ai-model/model_production.keras')
print(model.summary())

print("\nLoading scaler...")
scaler = joblib.load('c:/spendwise2/SpendWise/ai-model/scaler.joblib')
print(scaler)
print(vars(scaler))
