NSW PROPPREDICT (property predictor)
A website interface that uses our machine learning model to predict property prices accurately based on postcode and area. Created for Assignment 3, COS30049 - Group 28 ChilliPrawnPizza.

PREQUISTES:
Below are the necessary packages to run the application.

  FastAPI
  pip install fastapi

  Uvicorn
  pip install uvicorn

  Lucide
  pip install lucide-react

  Plotly
  pip install plotly

  Html2Canvas
  npm install html2canvas

  JsPDF
  npm install jspdf --save

  React Router Dom
  npm install react-router-dom

INSTALLATION:
  Clone the repository:
  git clone https://github.com/LA-111/Assignment3_COS30049_CPP

USAGE:
Instructions on how to run the app locally and start predicting.

  In a terminal, navigate to the project location:
  cd C:\Users\[yourlocation]\Assignment3_COS30049_CPP\

  Start the project with React:
  npm start

  This will host the app locally on http://localhost:3000. Before accessing the backend, start Uvicorn.

  In a new (second) terminal, navigate to the src folder:
  cd src

  Reload the back-end server using Uvicorn:
  uvicorn app:app --reload

The website should now be ready with full functionality. Enter a valid NSW postcode and a size (in square meters) to predict the price/weekly rent.

CONTRIBUTORS:
  Adnan Shamsul:  https://github.com/adnanxc

  Jeremy Allan:  https://github.com/Jeremy-Allan

  Lucas Annou: https://github.com/LA-111

CONTACT:
  Email: 104565600@student.swin.edu.au
  Phone: (04) 1234 5678