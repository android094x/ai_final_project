import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { MarkerIcon } from '../MarkerIcon.component';
import Routing from '../../routing';

import 'leaflet/dist/leaflet.css';
import './MapView.styles.scss';

const MapView = ({
  initialLat,
  initialLng,
  zoom,
  coords,
  lat,
  lng,
  map,
  setCoords,
  setLng,
  setLat,
  setMap,
  isMapInit,
  route
}) => {
  const handleMapClick = (e) => {
    let actualCoords = [];
    let actualLat = [];
    let actualLng = [];

    actualCoords = [...coords, [e.latlng.lat, e.latlng.lng]];
    actualLat = [...lat, e.latlng.lat];
    actualLng = [...lng, e.latlng.lng];

    setCoords(actualCoords);
    setLat(actualLat);
    setLng(actualLng);
  };

  const handleMarkerClick = (e) => {
    const clickedCoord = [e.latlng.lat, e.latlng.lng];
    const removeCoord = coords.filter(
      (coord) => coord[0] !== clickedCoord[0] && coord[1] !== clickedCoord[1]
    );
    const removeLat = lat.filter((lat) => lat !== clickedCoord[0]);
    const removeLng = lng.filter((lng) => lng !== clickedCoord[1]);

    setCoords(removeCoord);
    setLat(removeLat);
    setLng(removeLng);
  };

  const saveMap = (map) => {
    setMap(map);
  };

  return (
    <div>
      <Map
        center={[initialLat, initialLng]}
        zoom={zoom}
        onclick={handleMapClick}
        ref={saveMap}
      >
        <TileLayer url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=j5NGYto6hCHzeChqetFh" />
        {coords.map((position, index) => (
          <Marker
            key={`marker-${index}`}
            position={position}
            icon={MarkerIcon}
            onClick={handleMarkerClick}
          />
        ))}
        {isMapInit && <Routing map={map} route={route} />}
      </Map>
    </div>
  );
};

export default MapView;
