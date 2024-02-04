import React from 'react';
import './MetricBox.css'; // Importing CSS for styling

const MetricBox = ({ metricName, value, status }) => {
  // Determine the color based on the status
  const color = status === 1 ? 'red' : status === -1 ? 'red' : 'green';

  return (
    <div className="metric-box" style={{ backgroundColor: color }}>
      {metricName=="Temperature" ? (
            <div className="metric-value">{value + "°C"}</div>
          ) : (
            <div className="metric-value">{value + "%"}</div>
          )}
      
      
      <div className="metric-name">{metricName}</div>
    </div>
  );
};

export default MetricBox;
