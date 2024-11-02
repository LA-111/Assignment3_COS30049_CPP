import { React, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, DollarSign, Calendar, Download } from 'lucide-react';
import Plot from 'react-plotly.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PredictionDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const predictionData = state?.prediction;
  const detailRef = useRef();

  if (!predictionData) {
    return (
      <div>
        <p>Prediction failed to load! Please go back to the history page.</p>
        <button onClick={() => navigate('/history')}>Back to History</button>
      </div>
    );
  }

  const downloadPDF = async () => {
    const element = detailRef.current; // Capture the detail section

    const downloadButton = document.querySelector('.download-button'); // Hide the download button
    if (downloadButton) {                                              // So that it is not visible
      downloadButton.style.visibility = 'hidden';                      // when pdf is downloaded
    }

    const canvas = await html2canvas(element, {scale: 1.5 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust positioning and size as needed
    pdf.save('Prediction_Details.pdf');


    if (downloadButton) {
      downloadButton.style.visibility = 'visible';  // Restore download button
    }
  };

  return (
  <div ref={detailRef}> {/* Wrap enite content in a div with ref to allow for exporting*/}
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
            <span className="detail-value">${predictionData.price.toLocaleString()}</span>
          </div>
        </div>

        <div className="charts-grid">
          <div className="detail-card chart-card">
            <h2>Price Trend</h2>
            <Plot
              data={[
                {
                  x: predictionData.priceHistory?.labels || [],
                  y: predictionData.priceHistory?.data || [],
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: { color: '#2563eb' },
                  name: 'Price Trend',
                },
              ]}
              layout={{ title: 'Price Trend', xaxis: { title: 'Months' }, yaxis: { title: 'Price' } }}
              className="chart-container"
            />
          </div>


          <div className="detail-card chart-card">
            <h2>Area Comparison</h2>
            <Plot
              data={[
                {
                  x: predictionData.areaComparison?.labels || [],
                  y: predictionData.areaComparison?.data || [],
                  type: 'bar',
                  marker: { color: ['#2563eb', '#60a5fa', '#93c5fd'] },
                  name: 'Price Comparison',
                },
              ]}
              layout={{ title: 'Area Comparison', xaxis: { title: 'Comparison' }, yaxis: { title: 'Price' } }}
              className="chart-container"
            />
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
            <span className="detail-value">${Math.round(predictionData.weeklyRent)}</span>
          </div>
        </div>
      </div>
      <button onClick={downloadPDF} className="download-button">
          <Download size={16} style={{ marginRight: '8px' }} />
        Download as PDF
      </button>
    </div>
  </div> 
  );
};

export default PredictionDetail;