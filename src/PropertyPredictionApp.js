import React, { useState, useEffect } from 'react';
import { Home, MapPin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import './PropertyPredictionApp.css';

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
  const [dataFetched, setDataFetched] = useState(false); // New state to track data fetch completion
  const [error, setError] = useState(null);

  const fetchTrendData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/property_price_trend");
      const data = await response.json();

      if (data?.trend_data?.house_trend && data?.trend_data?.unit_trend) {
        const lineChartData = {
          data: [
            {
              x: data.trend_data.house_trend.map(item => item.year_month),
              y: data.trend_data.house_trend.map(item => item.purchase_price),
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Average Purchase Price - House',
              line: { color: 'rgb(75, 192, 192)' },
            },
            {
              x: data.trend_data.unit_trend.map(item => item.year_month),
              y: data.trend_data.unit_trend.map(item => item.purchase_price),
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Average Purchase Price - Unit',
              line: { color: 'rgb(153, 102, 255)' },
            },
          ],
          layout: {
            title: 'Property Price Trend',
            xaxis: { title: 'Year-Month' },
            yaxis: { title: 'Average Purchase Price' },
          },
        };
        setCharts(prevState => ({ ...prevState, lineChart: lineChartData }));
      }
    } catch (error) {
      console.error("Error fetching trend data:", error);
    }
  };

  const fetchComparisonData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/price_comparison");
      const data = await response.json();

      const barChartData = {
        data: [
          {
            x: data.comparison_data.map(item => item.property_type),
            y: data.comparison_data.map(item => item.purchase_price),
            type: 'bar',
            name: 'Average Purchase Price by Property Type',
            marker: {
              color: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            },
          },
        ],
        layout: {
          title: 'Price Comparison by Property Type',
          xaxis: { title: 'Property Type' },
          yaxis: { title: 'Average Purchase Price' },
        },
      };
      
      setCharts(prevState => ({ ...prevState, barChart: barChartData }));
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    }
  };

  const fetchSizeVsPriceData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/size_vs_price/${postCode}`);
      const data = await response.json();

      const scatterChartData = {
        data: [
          {
            x: data.size_price_data.map(item => item.area),
            y: data.size_price_data.map(item => item.purchase_price),
            type: 'scatter',
            mode: 'markers',
            name: 'Size vs. Price',
            marker: {
              color: 'rgba(255, 99, 132, 0.6)',
              size: 8,
            },
          },
        ],
        layout: {
          title: `Size vs Price in Postcode ${postCode}`,
          xaxis: { title: 'Area (sqm)' },
          yaxis: { title: 'Purchase Price' },
        },
      };
      
      setCharts(prevState => ({ ...prevState, scatterChart: scatterChartData }));
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

      if (!response.ok) throw new Error('Invalid postcode. Please enter a different postcode.');

      const data = await response.json();

      const newPrediction = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        propertyType,
        postCode,
        area,
        price: data.predicted_price,
        weeklyRent: data.predicted_rent,
      };
  
      setPrediction(newPrediction);

      // Fetch chart data and then set dataFetched to true once done
      await Promise.all([fetchTrendData(), fetchComparisonData(), fetchSizeVsPriceData()]);
      setDataFetched(true);  // Signal that data fetching is complete
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (dataFetched && prediction) {
      savePredictionToHistory(prediction);  // Save to history once dataFetched is true
      setDataFetched(false);  // Reset for future predictions
    }
  }, [dataFetched, prediction]);

  const savePredictionToHistory = (newPrediction) => {
    const predictionData = {
      id: new Date().getTime(),
      date: new Date().toLocaleString(),
      propertyType: newPrediction.propertyType,
      postCode: newPrediction.postCode,
      area: newPrediction.area,
      price: newPrediction.price,
      weeklyRent: newPrediction.weeklyRent,
      priceHistory: {
        labels: charts.lineChart?.data[0]?.x || [],
        data: charts.lineChart?.data[0]?.y || [],
      },
      areaComparison: {
        labels: charts.barChart?.data[0]?.x || [],
        data: charts.barChart?.data[0]?.y || [],
      },
      sizeComparison: {
        labels: charts.scatterChart?.data[0]?.x || [], // Make sure `x` corresponds to area (sqm)
        data: charts.scatterChart?.data[0]?.y || [],   // `y` should correspond to price
      },
    };

    const history = JSON.parse(localStorage.getItem('predictionsHistory')) || [];
    history.push(predictionData);
    localStorage.setItem('predictionsHistory', JSON.stringify(history));
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
            type="number"
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
            <Plot
              data={charts.lineChart.data}
              layout={charts.lineChart.layout}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />

          </div>
        )}
        {charts.scatterChart && (
          <div className="chart-wrapper">
            <Plot data={charts.scatterChart.data} layout={charts.scatterChart.layout} />
          </div>
        )}
        {charts.barChart && (
          <div className="chart-wrapper">
            <Plot data={charts.barChart.data} layout={charts.barChart.layout} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPredictionApp;
