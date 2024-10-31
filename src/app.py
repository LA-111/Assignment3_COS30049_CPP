from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Assignment2_prediction_model.prediction_model_test import (
    predict,
    get_price_trend_data,
    get_price_comparison_data,
    get_size_vs_price_data
)  # Import the prediction wrapper function

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

# Endpoint 1: Property Price Trend (Line Chart)
@app.get("/property_price_trend")
async def property_price_trend():
    trend_data = get_price_trend_data()
    if trend_data is None:
        raise HTTPException(status_code=500, detail="Error retrieving trend data.")
    return {"trend_data": trend_data}

# Endpoint 2: Price Comparison (Bar Chart)
@app.get("/price_comparison")
async def price_comparison():
    comparison_data = get_price_comparison_data()
    if comparison_data is None:
        raise HTTPException(status_code=500, detail="Error retrieving comparison data.")
    return {"comparison_data": comparison_data}

# Endpoint 3: Property Size vs. Price (Scatter Chart)
@app.get("/size_vs_price/{post_code}")
async def size_vs_price(post_code: int):
    size_price_data = get_size_vs_price_data(post_code)
    if size_price_data is None:
        raise HTTPException(status_code=404, detail="No data found for the given postcode.")
    return {"size_price_data": size_price_data}

