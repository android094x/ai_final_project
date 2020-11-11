import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import MapView from './components/MapView/MapView.component';
import Sidebar from './components/Sidebar/Sidebar.component';

const App = () => {
  const [coords, setCoords] = useState([]);
  const [lng, setLng] = useState([]);
  const [lat, setLat] = useState([]);
  const [adjMatrix, setAdjMatrix] = useState([]);
  const [map, setMap] = useState(null);
  const [isMapInit, setIsMapInit] = useState(false);

  useEffect(() => {
    setAdjMatrix([]);
    setIsMapInit(false);
  }, [coords]);

  useEffect(() => {
    if (adjMatrix.length > 0) {
      axios.post('http://localhost:5000/coords', {
        adjMatrix: adjMatrix,
        latitudes: lat,
        longitudes: lng
      });
    }
  }, [adjMatrix, lat, lng]);

  return (
    <div className="App">
      <MapView
        initialLat={10.39972}
        initialLng={-75.51444}
        zoom={14}
        coords={coords}
        lat={lat}
        lng={lng}
        map={map}
        isMapInit={isMapInit}
        setCoords={setCoords}
        setLat={setLat}
        setLng={setLng}
        setMap={setMap}
      />
      <Sidebar
        map={map}
        coords={coords}
        setAdjMatrix={setAdjMatrix}
        adjMatrix={adjMatrix}
        setIsMapInit={setIsMapInit}
      />
    </div>
  );
};

export default App;
