import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PropertyPredictionApp from './PropertyPredictionApp';
import HistoryPage from './HistoryPage';  
import PredictionDetails from './PredictionDetails';
import { Home, Phone, Clock } from 'lucide-react';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-brand">
              <Home />
              <span>PropPredict</span>
            </Link>
            <div className="navbar-links">
              <Link to="/" className="navbar-link">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/history" className="navbar-link">
                <Clock size={18} />
                <span>History</span>
              </Link>
              <Link to="/contact" className="navbar-link">
                <Phone size={18} />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
        < Routes>
            <Route path="/" element={<PropertyPredictionApp />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/prediction/:id" element={<PredictionDetails />} />
            <Route path="/contact" element={<div>Contact Page</div>} />
        </Routes>
        </main>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-section">
              <h3>PropPredict</h3>
              <p>Your trusted property prediction platform for NSW real estate market analysis.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/history">History</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <ul className="footer-links">
                <li>Email: info@proppredict.com</li>
                <li>Phone: (02) 1234 5678</li>
                <li>Address: Sydney, NSW 2000</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 PropPredict. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;