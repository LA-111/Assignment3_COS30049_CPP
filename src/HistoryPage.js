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
              onClick={() => handleItemClick(item)}>

                <p className="history-date">{item.date}</p>
                <p className="history-details">
                  {item.propertyType} - Postcode: {item.postCode}
                </p>
                <p className="history-prediction">
                  Predicted Price: ${item.price.toLocaleString()}
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