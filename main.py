import json
import pickle
import sys
import numpy as np
from fastapi import FastAPI

app = FastAPI()


num_of_bed = float(3)
num_of_bath = float(5)
total_area = float(3340)

sample_input = np.array([[num_of_bed, num_of_bath, total_area]], dtype=float)

model = pickle.load(open("model.pkl", "rb"))


@app.get("/predict")
def predict_price():
    prediction = model.predict(sample_input)
    price = str(int(prediction[0][0])) + "000"
    return {"prediction" : price}


@app.post("/price")
def get_price(data : dict):
    sample_input = np.array([float(data["num_of_bed"]), float(data["num_of_bath"]), float(data["total_area"])], dtype=float).reshape(1, -1)
    prediction = model.predict(sample_input)
    price = str(int(prediction[0][0])) + "000"
    return {"prediction" : price}

