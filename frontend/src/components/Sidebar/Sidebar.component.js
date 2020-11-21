import React from 'react';
import './Sidebar.styles.scss';
import L from 'leaflet';
import 'leaflet-routing-machine';
import axios from 'axios';

const Sidebar = ({ coords, setAdjMatrix, adjMatrix, setIsMapInit, setRoute }) => {
  const handleCalculateRoute = async (e) => {
    e.preventDefault();
    const responseCoords = [];
    const { data } = await axios.get('http://localhost:5000/coords');
    
    for (const coord of data.route2){
      responseCoords.push([coord[0].lat, coord[0].lng])
    };
    console.log(data)
    console.log(responseCoords)
    setRoute(responseCoords)
    setIsMapInit(true);
  };

  const handleCalculateDistance = async (e) => {
    e.preventDefault();
    const tempAdjMatrix = [];
    for (const coord of coords) {
      const actualPosition = {
        lat: coord[0],
        lng: coord[1]
      };
      const result = await createAdjMatrix(actualPosition, coords);
      tempAdjMatrix.push(result);
    }
    setAdjMatrix(tempAdjMatrix);
  };

  const createAdjMatrix = async (actualPosition, coordinates) => {
    let arr = [];
    for (let i in coords) {
      const distance = await calculateDistanceBetweenTwoPoints(
        actualPosition.lat,
        actualPosition.lng,
        coordinates[i][0],
        coordinates[i][1]
      );
      arr.push(distance);
    }
    return arr;
  };

  const calculateDistanceBetweenTwoPoints = (iLat, iLng, fLat, fLng) => {
    return new Promise((resolve, reject) => {
      const rWP1 = new L.Routing.Waypoint();
      rWP1.latLng = L.latLng(iLat, iLng);

      const rWP2 = new L.Routing.Waypoint();
      rWP2.latLng = L.latLng(fLat, fLng);

      const myRoute = L.Routing.osrmv1();
      myRoute.route([rWP1, rWP2], (err, routes) => {
        resolve(routes[0].summary.totalDistance);
      });
    });
  };

  const coord = coords.map((coord) => {
    return (
      <div className="coord">
        <div className="opt">{`Lat: ${coord[0]}`}</div>
        <div className="opt">{`Lng: ${coord[1]}`}</div>
      </div>
    );
  });
  return (
    <div className="Sidebar">
      <div className="title">Your Coords:</div>
      {coord}
      {adjMatrix.length === 0 ? (
        <button onClick={handleCalculateDistance} className="btn">
          Calculate Distance
        </button>
      ) : (
        <button onClick={handleCalculateRoute} className="btn">Calculate Route</button>
      )}
    </div>
  );
};

export default Sidebar;
