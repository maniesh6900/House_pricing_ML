import json
import pickle
import sys
import numpy as np

num_of_bed = float(sys.argv[1])
num_of_bath = float(sys.argv[2])
total_area = float(sys.argv[3])

sample_input = np.array([[num_of_bed, num_of_bath, total_area]], dtype=float)

model = pickle.load(open("model.pkl", "rb"))
prediction = model.predict(sample_input)
price = str(int(prediction[0][0])) + "000"

# Emit JSON so the Node process can parse reliably
print(json.dumps({"predicted_price": price}))
sys.stdout.flush()
