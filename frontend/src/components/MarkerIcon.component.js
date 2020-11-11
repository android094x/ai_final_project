import L from 'leaflet';

const MarkerIcon = new L.Icon({
  // iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('../pin.svg'),
  iconRetinaUrl: require('../pin.svg'),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [25, 35]
});

export { MarkerIcon };
