import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();

  // Mock history data - in a real app, this would come from your backend
  const historyItems = [
    {
      id: '1',
      date: 'October 31, 2024',
      propertyType: 'House',
      postCode: '2000',
      predictedPrice: 850000
    },
    {
      id: '2',
      date: 'October 30, 2024',
      propertyType: 'Unit',
      postCode: '2010',
      predictedPrice: 650000
    }
  ];

  const handleItemClick = (id) => {
    navigate(`/prediction/${id}`);
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <Clock size={32} className="history-icon" />
        <h1>Prediction History</h1>
      </div>
      
      <div className="history-content">
        <div className="history-card">
          <h2>Recent Predictions</h2>
          <div className="history-list">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="history-item"
                onClick={() => handleItemClick(item.id)}
              >
                <p className="history-date">{item.date}</p>
                <p className="history-details">
                  {item.propertyType} - Postcode: {item.postCode}
                </p>
                <p className="history-prediction">
                  Predicted Price: ${item.predictedPrice.toLocaleString()}
                </p>
                <ChevronRight className="history-arrow" size={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;