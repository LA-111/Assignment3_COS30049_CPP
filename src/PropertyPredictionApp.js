import React, { useState } from 'react';
import { Home, MapPin, DollarSign } from 'lucide-react';
import Plot from 'react-plotly.js'
import './PropertyPredictionApp.css';


const PropertyPredictionApp = () => {
  const [propertyType, setPropertyType] = useState('');
  const [postCode, setPostCode] = useState('');
  const [area, setArea] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [charts, setCharts] = useState(null);
  const [error, setError] = useState(null); 

  // Validate if the postcode is a valid NSW postcode
  const isValidPostcode = (code) => {
    const numericCode = parseInt(code, 10);
    return !isNaN(numericCode) && numericCode >= 2000 && numericCode <= 2999;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    // Validate inputs
    if (!isValidPostcode(postCode)) {
      setError('Invalid postcode. Please enter a valid NSW postcode (2xxx).');
      return;
    }
    if (!area || isNaN(area) || parseFloat(area) <= 0) {
      setError('Invalid area. Please enter a positive number for area.');
      return;
    }
  
    // Prepare the request payload
    const payload = {
      propertyType: propertyType,
      postCode: parseInt(postCode),
      area: parseFloat(area),
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch prediction.');
      }
  
      const data = await response.json();
  
      // Set prediction and charts with API response
      setPrediction({
        price: data.predicted_price,
        weeklyRent: data.predicted_rent,
      });

      const newPrediction = {
        id: Date.now().toString(), // unique identifier
        date: new Date().toLocaleDateString(),
        propertyType,
        postCode,
        area,
        price: data.predicted_price,
        weeklyRent: data.predicted_rent,
      };
  
      const history = JSON.parse(localStorage.getItem('predictionsHistory')) || [];
      localStorage.setItem('predictionsHistory', JSON.stringify([newPrediction, ...history]));
      
      setPrediction(newPrediction);

      setCharts({
        lineChart: {
          data: [
            {
              x: data.price_trend?.years || [],
              y: data.price_trend?.prices || [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: '#2563eb' },
              name: 'Price Trend',
            },
          ],
          layout: { title: 'Property Price Trend', xaxis: { title: 'Year' }, yaxis: { title: 'Price' } },
        },
        scatterChart: {
          data: [
            {
              x: data.rental_clusters?.x || [],
              y: data.rental_clusters?.y || [],
              mode: 'markers',
              marker: { size: 12, color: 'rgba(75, 192, 192, 0.6)' },
              name: 'Rental Clusters',
            },
            {
              x: [data.current_property?.x || 0],
              y: [data.current_property?.y || 0],
              mode: 'markers',
              marker: { size: 12, color: 'red' },
              name: 'Your Property',
            },
          ],
          layout: { title: 'Rental Cluster Analysis', xaxis: { title: 'X' }, yaxis: { title: 'Y' } },
        },
        barChart: {
          data: [
            {
              x: ['Your Property', 'Neighborhood Avg', 'City Avg'],
              y: [
                data.predicted_price,
                data.neighborhood_avg,
                data.city_avg 
              ],
              type: 'bar',
              marker: { color: ['#2563eb', '#60a5fa', '#93c5fd'] },
              name: 'Price Comparison',
            },
          ],
          layout: { title: 'Price Comparison', xaxis: { title: 'Category' }, yaxis: { title: 'Price' } },
        },
    });
  


  
    } catch (error) {
      setError(error.message);
    }
  };
  


  return (
    <div className="app-container">
      <h1 className="app-title">
        <span className="flex items-center justify-center">
          <Home className="mr-2" />
          Property Price Predictor
        </span>
      </h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label">
            Property Type:
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select type</option>
            <option value="house">House</option>
            <option value="unit">Unit</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label flex items-center">
            <MapPin className="mr-2" size={18} />
            Post Code:
          </label>
          <input
            type="text"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Area (sqm):
          </label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        <button
          type="submit"
          className="submit-button"
        >
          Predict Price
        </button>
      </form>

      {/* Error message div */}
      {error && <div className="error-message">{error}</div>}
      
      {prediction && (
        <div className="prediction-results">
          <h2 className="prediction-title">Prediction Results</h2>
          <p className="prediction-value flex items-center">
            <DollarSign className="mr-2" size={18} />
            Estimated Price: ${prediction.price.toLocaleString()}
          </p>
          <p className="flex items-center mt-1">
            <DollarSign className="mr-2" size={18} />
            Suggested Weekly Rent: ${prediction.weeklyRent.toLocaleString()}
          </p>
        </div>
      )}


      {charts && (
        <div className="charts-container">
          <div className="chart-wrapper">
            <h2 className="chart-title">Property Price Trend</h2>
            <Plot
              data={charts.lineChart.data}
              layout={charts.lineChart.layout}
              className="chart-container"
            />
          </div>
          <div className="chart-wrapper">
            <h2 className="chart-title">Rental Cluster Analysis</h2>
              <Plot
                data={charts.scatterChart.data}
                layout={charts.scatterChart.layout}
                className="chart-container"
              />
          </div>
          <div className="chart-wrapper">
            <h2 className="chart-title">Price Comparison</h2>
              <Plot
                data={charts.barChart.data}
                layout={charts.barChart.layout}
                className="chart-container"
              />
          </div>
        </div>
      )}
    </div>
  );
};


export default PropertyPredictionApp;