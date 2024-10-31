import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';

const PredictionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, you'd fetch this based on the id
  const predictionData = {
    id: id,
    date: "October 31, 2024",
    propertyType: "House",
    postCode: "2000",
    area: 150,
    predictedPrice: 850000,
    weeklyRent: 750,
    confidence: 85,
    priceHistory: {
      labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
      data: [800000, 820000, 835000, 845000, 850000, 855000]
    },
    areaComparison: {
      labels: ['Your Property', 'Area Average', 'City Average'],
      data: [850000, 880000, 920000]
    }
  };

  const lineChartData = {
    labels: predictionData.priceHistory.labels,
    datasets: [{
      label: 'Price Trend',
      data: predictionData.priceHistory.data,
      borderColor: '#2563eb',
      tension: 0.1
    }]
  };

  const barChartData = {
    labels: predictionData.areaComparison.labels,
    datasets: [{
      label: 'Price Comparison',
      data: predictionData.areaComparison.data,
      backgroundColor: ['#2563eb', '#60a5fa', '#93c5fd'],
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  return (
    <div className="prediction-detail-page">
      <button 
        className="back-button"
        onClick={() => navigate('/history')}
      >
        <ArrowLeft size={20} />
        Back to History
      </button>

      <div className="prediction-detail-header">
        <h1>Prediction Details</h1>
        <p className="prediction-date">
          <Calendar size={18} />
          {predictionData.date}
        </p>
      </div>

      <div className="prediction-detail-content">
        <div className="detail-card main-details">
          <div className="detail-item">
            <Home size={20} />
            <span className="detail-label">Property Type:</span>
            <span className="detail-value">{predictionData.propertyType}</span>
          </div>
          <div className="detail-item">
            <MapPin size={20} />
            <span className="detail-label">Post Code:</span>
            <span className="detail-value">{predictionData.postCode}</span>
          </div>
          <div className="detail-item">
            <DollarSign size={20} />
            <span className="detail-label">Predicted Price:</span>
            <span className="detail-value">${predictionData.predictedPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="charts-grid">
          <div className="detail-card chart-card">
            <h2>Price Trend</h2>
            <div className="chart-container">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          <div className="detail-card chart-card">
            <h2>Area Comparison</h2>
            <div className="chart-container">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="detail-card additional-info">
          <h2>Additional Information</h2>
          <div className="detail-item">
            <span className="detail-label">Property Area:</span>
            <span className="detail-value">{predictionData.area} m²</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Suggested Weekly Rent:</span>
            <span className="detail-value">${predictionData.weeklyRent}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Prediction Confidence:</span>
            <span className="detail-value">{predictionData.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetail;