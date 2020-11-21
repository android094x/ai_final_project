import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import MapView from './components/MapView/MapView.component';
import Sidebar from './components/Sidebar/Sidebar.component';
import Loading from './components/Loading/Loading.component';

const App = () => {
  const [coords, setCoords] = useState([]);
  const [route, setRoute] = useState([]);
  const [lng, setLng] = useState([]);
  const [lat, setLat] = useState([]);
  const [adjMatrix, setAdjMatrix] = useState([]);
  const [map, setMap] = useState(null);
  const [isMapInit, setIsMapInit] = useState(false);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAdjMatrix([]);
    setIsMapInit(false);
    console.log(coords)
  }, [coords]);

  useEffect(() => {
    if (adjMatrix.length > 0) {
      setLoading(!loading);
      axios.post('http://localhost:5000/coords', {
        adjMatrix: adjMatrix,
        latitudes: lat,
        longitudes: lng
      });
    }
  }, [adjMatrix, lat, lng]);

  return (
    <div className="App">
      { loading ? <Loading /> : null }
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
        route={route}
      />
      <Sidebar
        map={map}
        coords={coords}
        setAdjMatrix={setAdjMatrix}
        adjMatrix={adjMatrix}
        setIsMapInit={setIsMapInit}
        setRoute={setRoute}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default App;
