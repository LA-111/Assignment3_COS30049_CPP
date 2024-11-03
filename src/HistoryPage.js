import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = React.useState([]);

  React.useEffect(() => {
    const history = JSON.parse(localStorage.getItem('predictionsHistory')) || [];
    const sortedHistory = history.sort((a, b) => b.id - a.id);
    setHistoryItems(sortedHistory);
  }, []);

  const handleItemClick = (item) => {
    navigate(`/prediction/${item.id}`, { state: { prediction: item } });
  };
  
  const handleDeleteAll = () => {
    localStorage.removeItem('predictionsHistory');
    setHistoryItems([]);
  };

  // Helper function to capitalize property type
  const capitalizePropertyType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
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
            {historyItems.length > 0 ? (
              historyItems.map((item) => (
                <div 
                  key={item.id} 
                  className="history-item" 
                  onClick={() => handleItemClick(item)}>

                  <p className="history-date">{item.date}</p>
                  <p className="history-details">
                    {capitalizePropertyType(item.propertyType)} - Postcode: {item.postCode}
                  </p>
                  <p className="history-prediction">
                    Predicted Price: ${item.price.toLocaleString()}
                  </p>
                  <ChevronRight className="history-arrow" size={20} />
                  
                </div>
              ))
            ) : (
              <p>No prediction history available.</p>
            )}
          </div>
          <button onClick={handleDeleteAll} className="delete-button">
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;