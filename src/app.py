from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Assignment2_prediction_model.prediction_model_test import predict  # Import the prediction wrapper function

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model
class PropertyInput(BaseModel):
    propertyType: str
    postCode: int
    area: float

@app.post('/predict')
async def predict_endpoint(data: PropertyInput):
    property_type = data.propertyType.lower()
    post_code = data.postCode
    area = data.area

    # Call the predict function from prediction_model_test.py
    result, error = predict(property_type, post_code, area)

    if error:
        raise HTTPException(status_code=400, detail=error)

    return result
