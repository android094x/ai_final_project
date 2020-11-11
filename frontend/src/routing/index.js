import { MapLayer, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

class Routing extends MapLayer {
  createLeafletElement() {
    const { map, coords } = this.props;
    let waypoints = [];
    for (const coord of coords) {
      waypoints.push(L.latLng(coord[0], coord[1]));
    }

    console.log(map);

    let leafletElement = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      show: true,
      fitSelectedRoutes: false,
      createMarker: function () {
        return null;
      }
    }).addTo(map.leafletElement);
    return leafletElement.getPlan();
  }
}
export default withLeaflet(Routing);

// const init = async () => {
//   var map = L.map('map').setView([10.39972, -75.51444], 13);
//   L.tileLayer(
//     'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=j5NGYto6hCHzeChqetFh',
//     {
//       attribution:
//         '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
//     }
//   ).addTo(map);

//   distances = [];
//   const createAdjMatrix = async (actualPosition, coordinate) => {
//     r = [];
//     for (i in lista) {
//       const myDistance = await calculateDistance(
//         place.lat,
//         place.lng,
//         coor[i].lat,
//         coor[i].lng
//       );
//       r.push(myDistance);
//     }
//     return r;
//   }

//   const calculateDistanceBetweenTwoPoints = (iLat, iLng, fLat, fLng) => {
//     return new Promise((resolve, reject) => {
//       wayPoint1 = L.latLng(iLat, iLng);
//       wayPoint2 = L.latLng(fLat, fLng);

//       const myRoute = L.Routing.control({
//         waypoints: [wayPoint1, wayPoint2],
//         routeWhileDragging: false,
//         show: true,
//         fitSelectedRoutes: false
//       });

//       myRoute.on('routesfound', (e) => {
//         resolve(e.routes[0].summary.totalDistance);
//       });

//       myRouting.onAdd(map);
//     });
//   };

//   map.on('click', async (e) => {
//     var coord = e.latlng;
//     var lat = coord.lat;
//     var lng = coord.lng;
//     var coor = {
//       tag: 'punto uno, central',
//       lat: lat,
//       lng: lng
//     };
//     lista.push(coor);
//     console.log(lista);
//     var marker = L.marker([lat, lng]).addTo(map);
//     all_markers.push(marker);

//     ma = [];
//     for (i in lista) {
//       aux = lista[i];
//       data_for_point = await get_all_distances(aux, lista);
//       ma.push(data_for_point);
//     }

//     console.log('matrix', ma);
//   });
// };

// init();
