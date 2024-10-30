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
  const [charts, setCharts] = useState(null);
  const [error, setError] = useState(null); 

  // Validate if the postcode is a valid NSW postcode
  const isValidPostcode = (code) => {
    const numericCode = parseInt(code, 10);
    return !isNaN(numericCode) && numericCode >= 2000 && numericCode <= 2999;
  };


  const generateMockData = () => {
    const years = ['2018', '2019', '2020', '2021', '2022', '2023'];
    const prices = years.map(() => Math.floor(Math.random() * 500000) + 500000);
    
    const clusters = Array.from({ length: 20 }, () => ({
      x: Math.random() * 10,
      y: Math.random() * 10,
    }));
    
    const averagePrices = {
      'Your Property': Math.floor(Math.random() * 300000) + 700000,
      'Neighborhood Avg': Math.floor(Math.random() * 200000) + 800000,
      'City Avg': Math.floor(Math.random() * 100000) + 900000,
    };

    return { years, prices, clusters, averagePrices };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Reset previous errors

    // Validate correct inputs
    if (!isValidPostcode(postCode)) {
      setError('Invalid postcode. Please enter a valid NSW postcode (2xxx).');
      return;
    }

    if (!area || isNaN(area) || parseFloat(area) <= 0) {
      setError('Invalid area. Please enter a positive number for area.');
      return;
    }
    
    const mockData = generateMockData();
    
    // Generate mock prediction
    setPrediction({
      price: mockData.averagePrices['Your Property'],
      weeklyRent: Math.floor(Math.random() * 1000) + 500,
    });

    // Generate chart data
    setCharts({
      lineChart: {
        labels: mockData.years,
        datasets: [
          {
            label: 'Property Price Trend',
            data: mockData.prices,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
      scatterChart: {
        datasets: [
          {
            label: 'Rental Clusters',
            data: mockData.clusters,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
          {
            label: 'Your Property',
            data: [{ x: 5, y: 5 }],
            backgroundColor: 'red',
          },
        ],
      },
      barChart: {
        labels: Object.keys(mockData.averagePrices),
        datasets: [
          {
            label: 'Price Comparison',
            data: Object.values(mockData.averagePrices),
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
          },
        ],
      },
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Title',
      },
    },
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
            <div className="chart-container">
              <Line data={charts.lineChart} options={chartOptions} />
            </div>
          </div>
          <div className="chart-wrapper">
            <h2 className="chart-title">Rental Cluster Analysis</h2>
            <div className="chart-container">
              <Scatter data={charts.scatterChart} options={chartOptions} />
            </div>
          </div>
          <div className="chart-wrapper">
            <h2 className="chart-title">Price Comparison</h2>
            <div className="chart-container">
              <Bar data={charts.barChart} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default PropertyPredictionApp;