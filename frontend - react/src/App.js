import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [mongodbData, setMongodbData] = useState(null);
  const [postgresData, setPostgresData] = useState(null);


  const fetchDataFromMongoDB = () => {
    // Create an Axios instance with the baseURL
    const api = axios.create({
      baseURL: 'http://localhost:3001', // Replace with your Express server URL
    });

    // Make an HTTP GET request to your Express API endpoint
    api.get('/proxy-mongodb/mongodb')
      .then((response) => {
        setMongodbData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data from MongoDB:', error);
      });
  };


  const fetchDataFromPostgres = () => {
    // Create an Axios instance with the baseURL
    const api = axios.create({
      baseURL: 'http://localhost:3001', // Replace with your Express server URL
    });

    // Make an HTTP GET request to your Express API endpoint
    api.get('/proxy-get-data/postgres')
      .then((response) => {
        setPostgresData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data from MongoDB:', error);
      });
  };

  return (
    <div className="App">
      <button class="button-container" onClick={fetchDataFromMongoDB}>Role 1</button>
      <button class="button-container" onClick={fetchDataFromPostgres}>Role 2</button>
      <button class="button-container" >Role 3</button>
      {mongodbData ? (
        <div className="data-container">
          <h1>Datas from MongoDB:</h1>
          <pre>{JSON.stringify(mongodbData, null, 2)}</pre>
        </div>
      ) : (
        <p></p>
      )}
      {postgresData ? (
        <div>
          <h1>Data from Postgres:</h1>
          <pre>{JSON.stringify(postgresData, null, 2)}</pre>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default App;
