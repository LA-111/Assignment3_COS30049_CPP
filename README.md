<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="src/house.png" alt="Logo" width="40" height="40">
  </a>

<h3 align="center">Property Prediction Machine Learning App</h3>

  <p align="center">
    Website that makes use of our previously designed machine learning model to accurately make predictions of a houses price, based on postcode and area. 
    Created for Assignment 3, COS30049 - Group 28 ChilliPrawnPizza
    <br />
  </p>
</div>


<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributors">Contributors</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


# Getting Started 


### Prerequisites

Below shows the installation process of all the necessary packages in order to run our application.

* FastAPI
```bash
pip install fastapi
```

* Uvicorn
```bash
pip install uvicorn
```

* Lucide
```bash
pip install lucide-react
```

* Plotly
```bash
pip install plotly
```

* Html2Canvas
```sh
npm install html2canvas
```

* JsPDF
```sh
npm install jspdf --save
```

* React Router Dom
```
npm install react-router-dom
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

Cloning the repository:

```sh
git clone https://github.com/LA-111/Assignment3_COS30049_CPP
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

This section covers how to run the app locally and start predicting!

1. cd to the location of where the project is installed
```
cd C:\Users\[yourlocation]\Assignment3_COS30049_CPP\
```

2. Start the project using React
```bash
npm start
```
This will host the app locally on http://localhost:3000. This is where you can access the website. Before you can access the backend you need to start uvicorn!

3. cd to src folder
```bash
cd src
```

4. Reload the app using uvicorn
```bash
uvicorn app:app --reload
```
5. From this point the website should be ready, with functionality from the back end! Simply put an input into the postcode (ensuring it is a valid NSW postcode) and a size (measured in square metres) and the machine learning model should predict the price/weekly rent!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributors

Adnan Shamsul:  https://github.com/adnanxc

Jeremy Allan:  https://github.com/Jeremy-Allan

Lucas Annou: https://github.com/LA-111

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Email us: info@proppredict.com

Call us: (02) 1234 5678

<p align="right">(<a href="#readme-top">back to top</a>)</p>