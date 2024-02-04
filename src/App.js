import './App.css';
import ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from 'react';
import MetricBox from './MetricBox';



async function fetchData() {
  try {
    const response = await fetch("http://brownhackathon.devices.brown.edu:5000/data");
    const json = await response.json();
    console.log(json);
    return json; // Return the fetched data
  } catch (error) {
    const json = {
      temperature:20,
      moisture:32,
      light:50,
      water_level:60
    }
    return json; // Return the fetched data
  }
}




function App() {

  const handleFillWater = async () => {
    try {
      const response = await fetch("http://brownhackathon.devices.brown.edu:5000/fill", {
        method: 'POST',
      });
      const data = await response.json(); // Assuming the server sends back some data
      console.log("Water filled:", data);
      // Update your state or UI based on the response if needed
    } catch (error) {
      console.error("Error filling water:", error);
    }
  };
  
  const handleNotFillWater = async () => {
    try {
      const response = await fetch("http://brownhackathon.devices.brown.edu:5000/empty", {
        method: 'POST',
      });
      const data = await response.json(); // Assuming the server sends back some data
      console.log("Water unfill action triggered:", data);
      // Update your state or UI based on the response if needed
    } catch (error) {
      console.error("Error triggering unfill action:", error);
    }
  };
  
  const [temperature, setTemperature] = useState(25); // default to 25 celsius
  // Function to handle changes in the input field
  const handleTemperatureChange = (event) => {
    setTemperature(event.target.value);
  };
  const [moisture, setMoisture] = useState(100); // default to 50%
  // Function to handle changes in the input field
  const handleMoistureChange = (event) => {
    setMoisture(event.target.value);
  };
  const [light, setLight] = useState(50); // Default to an initial value, adjust as needed
  // Function to handle changes in the input field for light
  const handleLightChange = (event) => {
    setLight(event.target.value);
  };
  const [water_level, setWater_level] = useState(50); // Default to an initial value, adjust as needed
  // Function to handle changes in the input field for water level
  const handleWater_levelChange = (event) => {
    setWater_level(event.target.value);
  };


  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const fetchedData = await fetchData();
      if (fetchedData) {
        setTemperature(fetchedData.temperature);
        setMoisture(fetchedData.moisture);
        setLight(fetchedData.light);
        setWater_level(fetchedData.water_level);


      }

    }, 2000); // Fetch data every second

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array indicates this effect doesn't depend on any props or state



  useEffect(() => {
    const interval = setInterval(() => {
      updateAlerts();// update the alerts
    }, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [temperature, moisture, light, water_level]);

  // Example function to check metric status
  const updateAlerts = () => {
    // Check temperature status
    if (checkTempStatus() === 1) {
      addAlert("Temperature is high", "temperature");
    } else if (checkTempStatus() === -1) {
      addAlert("Temperature is low", "temperature");
    } else {
      removeAlert("temperature");
    }

    // Check moisture status
    if (checkMoistureStatus() === 1) {
      addAlert("Moisture is high", "moisture");
    } else if (checkMoistureStatus() === -1) {
      addAlert("Moisture is low", "moisture");
    } else {
      removeAlert("moisture");
    }

    // Check water level status
    if (checkWaterStatus() === 1) {
      addAlert("Water level is high", "water_level");
    } else if (checkWaterStatus() === -1) {
      console.log("added water alert")
      addAlert("Water level is low", "water_level");
    } else {
      removeAlert("water_level");
    }

    // Check light status
    if (checkLightStatus() === 1) {
      addAlert("Light level is high", "light");
    } else if (checkLightStatus() === -1) {
      addAlert("Light level is low", "light");
    } else {
      removeAlert("light");
    }
  };


  // Function to add an alert
  const addAlert = (message, metric) => {
    setAlerts(prev => [...prev.filter(alert => alert.metric !== metric), { message, metric }]);
  };

  // Function to remove an alert
  const removeAlert = (metric) => {
    setAlerts(prev => prev.filter(alert => alert.metric !== metric));
  };



  // Returns status of temperature
  // Returns 0 for normal, 1 for high, -1 for low
  const checkTempStatus = () => {
    if (temperature > 30) { // Example: High if above 30°C
      return 1;
    } else if (temperature < 10) { // Example: Low if below 10°C
      return -1;
    }
    return 0;
  }

  // Returns status of moisture
  // Returns 0 for normal, 1 for high, -1 for low
  const checkMoistureStatus = () => {
    if (moisture < 30) {
      return -1;
    }
    return 0;
  }

  const checkLightStatus = () => {
    if (light < 30) { // Low light condition
      return -1;
    }
    return 0; // Normal light condition
  };

  const checkWaterStatus = () => {
    return 0; // Normal water level condition
  };

  return (
    <div className="App">
      <header className="App-header">


        <h1 className="main-title">CosmoCrops</h1>
        <div className="status-page">
          <MetricBox metricName={"Temperature"} value={temperature} status={checkTempStatus()} />
          <MetricBox metricName={"Moisture"} value={moisture} status={checkMoistureStatus()} />
          <MetricBox metricName={"Water Level"} value={water_level} status={checkWaterStatus()} />
          <MetricBox metricName={"Light"} value={light} status={checkLightStatus()} />
        </div>
      </header>
      <div className="water-control-buttons">
        <button className="water-button" onClick={handleFillWater}>Fill Water</button>
        <button className="water-button" onClick={handleNotFillWater}>Don't Fill</button>
      </div>
    </div>

  );
}


export default App;


ReactDOM.render(<App />, document.getElementById("root"));