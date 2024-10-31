import numpy as np
import pandas as pd  # For handling dataframes
from datetime import datetime  # Already imported for handling the current year
import joblib
from sklearn.preprocessing import StandardScaler  # Assuming you're using it to scale input data
from sklearn.ensemble import RandomForestRegressor  # Assuming you're using Random Forest models
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

merged_df = joblib.load(r'C:\Users\AdnanShamsul\Downloads\Swinburne\Assignment3_COS30049_CPP\src\Assignment2_prediction_model\merged_df.joblib')
house_df = joblib.load(r'C:\Users\AdnanShamsul\Downloads\Swinburne\Assignment3_COS30049_CPP\src\Assignment2_prediction_model\house_df.joblib')
unit_df = joblib.load(r'C:\Users\AdnanShamsul\Downloads\Swinburne\Assignment3_COS30049_CPP\src\Assignment2_prediction_model\unit_df.joblib')

rf_house = joblib.load(r'C:\Users\AdnanShamsul\Downloads\Swinburne\Assignment3_COS30049_CPP\src\Assignment2_prediction_model\rf_house_model.joblib')
rf_unit = joblib.load(r'C:\Users\AdnanShamsul\Downloads\Swinburne\Assignment3_COS30049_CPP\src\Assignment2_prediction_model\rf_unit_model.joblib')
classification_scaler = joblib.load(r'C:\Users\AdnanShamsul\Downloads\Swinburne\Assignment3_COS30049_CPP\src\Assignment2_prediction_model\classification_scaler_house.joblib')

best_rf_model_house = joblib.load(r'C:\Users\AdnanShamsul\Downloads\Swinburne\Assignment3_COS30049_CPP\src\Assignment2_prediction_model\house_price_model.joblib')
best_rf_model_unit = joblib.load(r'C:\Users\AdnanShamsul\Downloads\Swinburne\Assignment3_COS30049_CPP\src\Assignment2_prediction_model\unit_price_model.joblib')
scaler = joblib.load(r'C:\Users\AdnanShamsul\Downloads\Swinburne\Assignment3_COS30049_CPP\src\Assignment2_prediction_model\scaler.joblib')


def classify_and_get_rent(property_type, size_category_encoded, council_name_encoded):
    
    # Create a dataframe with the user inputs (council_name_encoded and size_category_encoded)
    new_data = pd.DataFrame([[council_name_encoded, size_category_encoded]], columns=['council_name_encoded', 'size_category_encoded'])
    
    # Scale the inputs based on the scaler used earlier
    new_data_scaled = classification_scaler.transform(new_data)
    
    # Classify the new house/unit based on the property type using the RandomForestClassifier
    if property_type == 'house':
        cluster = rf_house.predict(new_data_scaled)[0]
        cluster_rent_df = house_df.groupby('cluster')['Weekly Rent'].mean().reset_index()
    elif property_type == 'unit':
        cluster = rf_unit.predict(new_data_scaled)[0]
        cluster_rent_df = unit_df.groupby('cluster')['Weekly Rent'].mean().reset_index()
    
    # Get the suggested weekly rent for the cluster
    suggested_rent = cluster_rent_df[cluster_rent_df['cluster'] == cluster]['Weekly Rent'].values[0]
    
    return suggested_rent



size_category_mapping = {
    'very small': 0,
    'small': 1,
    'medium': 2,
    'large': 3,
    'very large': 4
}

def map_area_to_size_category (property_type, area):
    if property_type == 'house':
        if area <= 472:                     # 25th percentile
            size_category = 'very small'
        elif 472 < area <= 634:             # 50th percentile
            size_category = 'small'
        elif 634 < area <= 848:             # 75th percentile
            size_category = 'medium'
        elif 848 < area <= 1000:            # arbitrary cutoff
            size_category = 'large'
        else:
            size_category = 'very large'    # arbitrary cutoff

    elif property_type == 'unit':
        if area <= 94:
            size_category = 'very small'    # 25th percentile
        elif 94 < area <= 119:
            size_category = 'small'         # 50th percentile
        elif 119 < area <= 177:
            size_category = 'medium'        # 75th percentile
        elif 177 < area <= 250:
            size_category = 'large'         # arbitrary cutoff
        else:
            size_category = 'very large'    # arbitrary cutoff

    return size_category


council_mapping = {
    # Sydney Metro and Surrounds
    'CITY OF SYDNEY': 1,
    'INNER WEST': 2,
    'CANTERBURY-BANKSTOWN': 3,
    'BAYSIDE': 4,
    'RANDWICK': 5,
    'WAVERLEY': 6,
    'WOOLLAHRA': 7,
    'NORTH SYDNEY': 8,
    'LANE COVE': 9,
    'WILLOUGHBY': 10,
    'MOSMAN': 11,
    'NORTHERN BEACHES': 12,
    'KU-RING-GAI': 13,
    'HORNSBY': 14,
    'THE HILLS SHIRE': 15,
    'PARRAMATTA': 16,
    'RYDE': 17,
    'HUNTERS HILL': 18,
    'CANADA BAY': 19,
    'BURWOOD': 20,
    'STRATHFIELD': 21,
    'CUMBERLAND': 22,
    'FAIRFIELD': 23,
    'LIVERPOOL': 24,
    'CAMPBELLTOWN': 25,
    'CAMDEN': 26,
    'WOLLONDILLY': 27,
    'BLACKTOWN': 28,
    'PENRITH': 29,
    'BLUE MOUNTAINS': 30,
    'HAWKESBURY': 31,

    # Illawarra and South Coast
    'WOLLONGONG': 32,
    'SHELLHARBOUR': 33,
    'KIAMA': 34,
    'SHOALHAVEN': 35,
    'WINGECARRIBEE': 36,
    'EUROBODALLA': 37,
    'BEGA VALLEY': 38,

    # Central Coast and Hunter
    'CENTRAL COAST': 39,
    'LAKE MACQUARIE': 40,
    'NEWCASTLE': 41,
    'PORT STEPHENS': 42,
    'MAITLAND': 43,
    'CESSNOCK': 44,
    'DUNGOG': 45,
    'SINGLETON': 46,
    'MUSWELLBROOK': 47,
    'UPPER HUNTER SHIRE': 48,

    # North Coast
    'MID-COAST': 49,
    'PORT MACQUARIE-HASTINGS': 50,
    'KEMPSEY': 51,
    'NAMBUCCA': 52,
    'BELLINGEN': 53,
    'COFFS HARBOUR': 54,
    'CLARENCE VALLEY': 55,
    'RICHMOND VALLEY': 56,
    'KYOGLE': 57,
    'LISMORE': 58,
    'BALLINA': 59,
    'BYRON': 60,
    'TWEED': 61,

    # New England and North West
    'TENTERFIELD': 62,
    'GLEN INNES SEVERN': 63,
    'INVERELL': 64,
    'ARMIDALE REGIONAL': 65,
    'URALLA': 66,
    'WALCHA': 67,
    'TAMWORTH REGIONAL': 68,
    'GWYDIR': 69,
    'MOREE PLAINS': 70,
    'NARRABRI': 71,
    'GUNNEDAH': 72,
    'LIVERPOOL PLAINS': 73,

    # Central West and Orana
    'MID-WESTERN REGIONAL': 74,
    'LITHGOW': 75,
    'OBERON': 76,
    'BATHURST REGIONAL': 77,
    'ORANGE': 78,
    'BLAYNEY': 79,
    'CABONNE': 80,
    'COWRA': 81,
    'FORBES': 82,
    'PARKES': 83,
    'LACHLAN': 84,
    'WEDDIN': 85,
    'DUBBO REGIONAL': 86,
    'NARROMINE': 87,
    'WARREN': 88,
    'BOGAN': 89,
    'COONAMBLE': 90,
    'WARRUMBUNGLE': 91,
    'GILGANDRA': 92,

    # Far West and Orana
    'WALGETT': 93,
    'BREWARRINA': 94,
    'BOURKE': 95,
    'COBAR': 96,
    'BROKEN HILL': 97,
    'CENTRAL DARLING': 98,

    # Riverina and Murray
    'GRIFFITH': 99,
    'LEETON': 100,
    'NARRANDERA': 101,
    'MURRUMBIDGEE': 102,
    'CARRATHOOL': 103,
    'HAY': 104,
    'EDWARD RIVER': 105,
    'MURRAY RIVER': 106,
    'BERRIGAN': 107,
    'FEDERATION': 108,
    'ALBURY': 109,
    'GREATER HUME': 110,
    'LOCKHART': 111,
    'WAGGA WAGGA': 112,
    'COOLAMON': 113,
    'JUNEE': 114,
    'TEMORA': 115,
    'COOTAMUNDRA-GUNDAGAI': 116,

    # Southern Tablelands and Snowy Mountains
    'YASS VALLEY': 117,
    'GOULBURN MULWAREE': 118,
    'UPPER LACHLAN SHIRE': 119,
    'QUEANBEYAN-PALERANG REGIONAL': 120,
    'SNOWY MONARO REGIONAL': 121,
    'SNOWY VALLEYS': 122,

    # Far West
    'BALRANALD': 123,
    'WENTWORTH': 124,

    # South West
    'HILLTOPS': 125,

    # North West
    'UNINCORPORATED FAR WEST': 126

}


def get_council_name_encoded(post_code):
    original_post_code = int(post_code)
    
    def search_nearby_postcodes(post_code):
        offset = 0
        while offset <= 100:  # Limit the search range to 100 in each direction
            for direction in [-1, 1]:  # Check lower, then higher
                check_post_code = post_code + (direction * offset)
                matching_rows = merged_df[merged_df['post_code'] == check_post_code]
                if not matching_rows.empty:
                    return check_post_code, matching_rows
            offset += 1
        return None, None

    def get_encoded_value(rows):
        council_name = rows['council_name'].iloc[0]
        return council_mapping.get(council_name.upper(), None)

    # Check the original postcode first
    matching_rows = merged_df[merged_df['post_code'] == original_post_code]
    
    if not matching_rows.empty:
        encoded_value = get_encoded_value(matching_rows)
        if encoded_value is not None:
            return encoded_value, original_post_code

    # If not found, search nearby postcodes
    found_post_code, found_rows = search_nearby_postcodes(original_post_code)
    if found_post_code:
        encoded_value = get_encoded_value(found_rows)
        if encoded_value is not None:
            print(f"No data for {original_post_code}. Using nearest postcode {found_post_code}.")
            return encoded_value, found_post_code

    print(f"No valid postcode found near {original_post_code}.")
    return None, None

def get_user_input():
    print("Welcome to the Property Price Prediction Tool!")
    
    # Get property type
    property_type = input("Are you predicting for a house or a unit? (house/unit): ").lower()
    while property_type not in ['house', 'unit']:
        property_type = input("Invalid input. Please enter 'house' or 'unit': ").lower()
    
    # Get and validate post_code
    while True:
        post_code = input("Enter the post code: ")
        if post_code.isdigit():
            council_name_encoded, valid_post_code = get_council_name_encoded(int(post_code))
            if council_name_encoded is not None:
                break
            else:
                print("No data available for this post code. Please try another.")
        else:
            print("Invalid input. Please enter a numeric post code.")

    # Get and validate size category
    area = float(input("Enter the area in square meters: "))

    size_category = map_area_to_size_category(property_type, area)
    while size_category not in size_category_mapping:
        size_category = input("Invalid input. Please try again: ").lower()

    size_category_encoded = size_category_mapping[size_category]

    contract_year = datetime.now().year

    
    return property_type, valid_post_code, size_category_encoded, council_name_encoded, contract_year

def predict_price(property_type, post_code, size_category_encoded, council_name_encoded, scaler, best_rf_model_house, best_rf_model_unit, contract_year):
    # Prepare input data for prediction
    input_data = pd.DataFrame([[post_code, size_category_encoded, council_name_encoded, contract_year]], 
                          columns=['post_code', 'size_category_encoded', 'council_name_encoded', 'contract_year'])

    # Transform the input data (keeping DataFrame with column names)
    input_scaled = scaler.transform(input_data)


    #print("Scaled input:", input_scaled)  # Debug: Print the scaled input

    # Choose model based on property type
    model = best_rf_model_house if property_type == 'house' else best_rf_model_unit
    return model.predict(input_scaled)[0]

def predict(property_type, post_code, area):
    """Wrapper function for FastAPI to predict price and rent."""
    size_category = map_area_to_size_category(property_type, area)
    size_category_encoded = size_category_mapping.get(size_category)

    # Validate inputs
    if size_category_encoded is None:
        return None, "Invalid size category."

    council_name_encoded, valid_post_code = get_council_name_encoded(post_code)
    if council_name_encoded is None:
        return None, "No data for the provided postcode."

    contract_year = datetime.now().year

    predicted_price = predict_price(
        property_type, valid_post_code, size_category_encoded, 
        council_name_encoded, scaler, best_rf_model_house, 
        best_rf_model_unit, contract_year
    )

    predicted_weekly_rent = classify_and_get_rent(
        property_type, size_category_encoded, council_name_encoded
    )

    return {
        "predicted_price": predicted_price,
        "predicted_rent": predicted_weekly_rent
    }, None

def main(scaler, best_rf_model_house, best_rf_model_unit):
    # Get user inputs and predict price
    while True:
        property_type, post_code, size_category_encoded, council_name_encoded, contract_year = get_user_input()

        predicted_weekly_rent = classify_and_get_rent(property_type, size_category_encoded, council_name_encoded)

        print(f"\nPredicted weekly rent for the {property_type}: ${predicted_weekly_rent:,.2f}")


        predicted_price = predict_price(property_type, post_code, size_category_encoded, council_name_encoded, scaler, best_rf_model_house, best_rf_model_unit, contract_year)

        print(f"\nPredicted price for the {property_type}: ${predicted_price:,.2f}")

#main(scaler, best_rf_model_house, best_rf_model_unit)

# Data functions for charts
def get_price_trend_data():
    try:
        # Ensure contract_date is parsed as datetime
        merged_df['year_month'] = pd.to_datetime(merged_df['contract_date']).dt.to_period('M')

        # Calculate average price trend for houses
        house_trend = (
            merged_df[merged_df['property_type'] == 'house']
            .groupby('year_month')['purchase_price']
            .mean()
            .reset_index()
        )

        # Calculate average price trend for units
        unit_trend = (
            merged_df[merged_df['property_type'] == 'unit']
            .groupby('year_month')['purchase_price']
            .mean()
            .reset_index()
        )

        # Convert periods to strings for JSON serialization
        house_trend['year_month'] = house_trend['year_month'].astype(str)
        unit_trend['year_month'] = unit_trend['year_month'].astype(str)

        return {
            "house_trend": house_trend.to_dict(orient="records"),
            "unit_trend": unit_trend.to_dict(orient="records")
        }
    except Exception as e:
        print(f"Error in get_price_trend_data: {e}")
        return None

def get_price_comparison_data():
    try:
        comparison_data = merged_df.groupby('property_type')['purchase_price'].mean().reset_index()
        return comparison_data.to_dict(orient="records")
    except Exception as e:
        print(f"Error in get_price_comparison_data: {e}")
        return None

def get_size_vs_price_data(post_code):
    try:
        size_price_data = merged_df[merged_df['post_code'] == post_code][['area', 'purchase_price']]
        return size_price_data.to_dict(orient="records")
    except Exception as e:
        print(f"Error in get_size_vs_price_data for postcode {post_code}: {e}")
        return None