import pickle
import numpy as np

model = pickle.load(open('model.pkl', 'rb'))



sample_input = np.array([
    3,      
    4,      
    1380,   

])

prediction = model.predict([sample_input])
print("Predicted Price:", prediction[0][0])