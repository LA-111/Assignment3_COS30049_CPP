import React, { useState } from 'react';
import { Home, MapPin, DollarSign } from 'lucide-react';
import { Line, Scatter, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './PropertyPredictionApp.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PropertyPredictionApp = () => {
  const [propertyType, setPropertyType] = useState('');
  const [postCode, setPostCode] = useState('');
  const [area, setArea] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [charts, setCharts] = useState({
    lineChart: null,
    barChart: null,
    scatterChart: null,
  });
  const [error, setError] = useState(null);

  const fetchTrendData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/property_price_trend");
      const data = await response.json();
      console.log("Trend Data:", data);

      if (data?.trend_data?.house_trend && data?.trend_data?.unit_trend) {
        const chartData = {
          labels: data.trend_data.house_trend.map(item => item.year_month),
          datasets: [
            {
              label: 'Average Purchase Price - House',
              data: data.trend_data.house_trend.map(item => item.purchase_price),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
            {
              label: 'Average Purchase Price - Unit',
              data: data.trend_data.unit_trend.map(item => item.purchase_price),
              borderColor: 'rgb(153, 102, 255)',
              tension: 0.1,
            },
          ],
        };
        setCharts(prevState => ({ ...prevState, lineChart: chartData }));
      } else {
        console.error("Error: Missing trend data for house or unit.");
      }
    } catch (error) {
      console.error("Error fetching trend data:", error);
    }
  };

  const fetchComparisonData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/price_comparison");
      const data = await response.json();
      console.log("Comparison Data:", data);

      const chartData = {
        labels: data.comparison_data.map(item => item.property_type),
        datasets: [
          {
            label: 'Average Purchase Price by Property Type',
            data: data.comparison_data.map(item => item.purchase_price),
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
          },
        ],
      };
      setCharts(prevState => ({ ...prevState, barChart: chartData }));
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    }
  };

  const fetchSizeVsPriceData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/size_vs_price/${postCode}`);
      const data = await response.json();
      console.log("Size vs Price Data:", data);

      const chartData = {
        datasets: [
          {
            label: 'Size vs. Price',
            data: data.size_price_data.map(item => ({ x: item.area, y: item.purchase_price })),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
      setCharts(prevState => ({ ...prevState, scatterChart: chartData }));
    } catch (error) {
      console.error("Error fetching size vs price data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isNaN(postCode) || postCode < 2000 || postCode > 2999) {
      setError('Invalid postcode. Please enter a valid NSW postcode (2xxx).');
      return;
    }
    if (!area || isNaN(area) || parseFloat(area) <= 0) {
      setError('Invalid area. Please enter a positive number for area.');
      return;
    }

    const payload = { propertyType, postCode: parseInt(postCode), area: parseFloat(area) };
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to fetch prediction.');

      const data = await response.json();
      setPrediction({ price: data.predicted_price, weeklyRent: data.predicted_rent });

      // Fetch charts data after prediction request is successful
      fetchTrendData();
      fetchComparisonData();
      fetchSizeVsPriceData();
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
          <label className="form-label">Property Type:</label>
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
          <label className="form-label">Area (sqm):</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        <button type="submit" className="submit-button">Predict Price</button>
      </form>

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

      <div className="charts-container">
        {charts.lineChart && (
          <div className="chart-wrapper">
            <h2 className="chart-title">Property Price Trend</h2>
            <Line data={charts.lineChart} options={{ responsive: true }} />
          </div>
        )}
        {charts.scatterChart && (
          <div className="chart-wrapper">
            <h2 className="chart-title">Size vs Price in Postcode {postCode}</h2>
            <Scatter data={charts.scatterChart} options={{ responsive: true }} />
          </div>
        )}
        {charts.barChart && (
          <div className="chart-wrapper">
            <h2 className="chart-title">Price Comparison by Property Type</h2>
            <Bar data={charts.barChart} options={{ responsive: true }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPredictionApp;
