// import { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-geosearch/dist/geosearch.css";

// // Fix Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // Nepal's geographical boundaries
// const NEPAL_BOUNDS = L.latLngBounds(
//   L.latLng(26.3479, 80.0582), // Southwest coordinates
//   L.latLng(30.4469, 88.2015) // Northeast coordinates
// );

// // Center of Nepal
// const NEPAL_CENTER = [28.3949, 84.124];

// const SearchControl = ({ provider }) => {
//   const map = useMap();

//   useEffect(() => {
//     const searchControl = new GeoSearchControl({
//       provider,
//       style: "bar",
//       autoComplete: true,
//       autoCompleteDelay: 250,
//       showMarker: true,
//       retainZoomLevel: false,
//       animateZoom: true,
//       keepResult: true,
//     });

//     map.addControl(searchControl);
//     return () => map.removeControl(searchControl);
//   }, [map, provider]);

//   return null;
// };

// const Map = () => {
//   const [userPosition, setUserPosition] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const provider = new OpenStreetMapProvider();

//   // Example parking spaces data
//   const parkingSpaces = [
//     {
//       id: 1,
//       name: "City Center Parking",
//       description: "Capacity: 100 cars, Price: $5/hour",
//       position: [27.7172, 85.324], // Latitude and Longitude
//     },
//     {
//       id: 2,
//       name: "Mall Parking",
//       description: "Capacity: 50 cars, Price: $3/hour",
//       position: [27.7105, 85.3256],
//     },
//   ];
//   const parkingIcon = new L.Icon({
//     iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png", // URL to a parking icon
//     iconSize: [32, 32], // Size of the icon
//     iconAnchor: [16, 32], // Anchor point of the icon
//   });

//   useEffect(() => {
//     // Get user's current location
//     if (navigator.geolocation) {
//       console.log("Geolocation is supported by the browser.");

//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           console.log("Location retrieved successfully:", position);
//           const { latitude, longitude } = position.coords;
//           const userLocation = L.latLng(latitude, longitude);

//           // Check if the user is within Nepal's bounds
//           if (NEPAL_BOUNDS.contains(userLocation)) {
//             console.log("User is within Nepal:", userLocation);
//             setUserPosition(userLocation);
//           } else {
//             console.log("User is outside Nepal:", userLocation);
//             setLocationError("You are not in Nepal.");
//           }
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           switch (error.code) {
//             case error.PERMISSION_DENIED:
//               setLocationError(
//                 "Permission denied. Please enable location access."
//               );
//               break;
//             case error.POSITION_UNAVAILABLE:
//               setLocationError("Location information is unavailable.");
//               break;
//             case error.TIMEOUT:
//               setLocationError("The request to get location timed out.");
//               break;
//             default:
//               setLocationError("Unable to retrieve your location.");
//           }
//         },
//         {
//           enableHighAccuracy: true, // Use high-accuracy mode
//           timeout: 10000, // 10 seconds timeout
//           maximumAge: 0, // Do not use a cached position
//         }
//       );
//     } else {
//       console.log("Geolocation is not supported by the browser.");
//       setLocationError("Geolocation is not supported by your browser.");
//     }
//   }, []);

//   // Zoom to user's current location
//   const ZoomToLocation = ({ userPosition }) => {
//     const map = useMap();

//     useEffect(() => {
//       if (userPosition) {
//         map.flyTo(userPosition, 15); // Zoom to level 15 (you can adjust this)
//       }
//     }, [userPosition, map]);

//     return null;
//   };

//   return (
//     <div
//       className="border-2 border-black-500 h-96 m-5 rounded-lg"
//       //   style={{ height: "80vh", width: "100%" }}
//     >
//       <MapContainer
//         center={NEPAL_CENTER}
//         zoom={7}
//         style={{ height: "100%", width: "100%" }}
//         minZoom={7}
//         maxBounds={NEPAL_BOUNDS}
//         maxBoundsViscosity={1.0}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <SearchControl provider={provider} />

//         {/* Marker for user's current location */}
//         {userPosition && (
//           <Marker position={userPosition}>
//             <Popup>You are here</Popup>
//           </Marker>
//         )}

//         {/* Markers for parking spaces */}
//         {parkingSpaces.map((parking) => (
//           <Marker
//             key={parking.id}
//             position={parking.position}
//             icon={parkingIcon}
//           >
//             <Popup>
//               <strong>{parking.name}</strong>
//               <br />
//               {parking.description}
//             </Popup>
//           </Marker>
//         ))}

//         {/* Zoom to user's current location */}
//         {userPosition && <ZoomToLocation userPosition={userPosition} />}
//       </MapContainer>

//       {/* Display location error */}
//       {locationError && (
//         <div
//           style={{
//             position: "absolute",
//             top: "10px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             padding: "10px",
//             backgroundColor: "red",
//             color: "white",
//             borderRadius: "5px",
//             zIndex: 1000,
//           }}
//         >
//           {locationError}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Map;

// import { useState, useEffect, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-geosearch/dist/geosearch.css";
// import polyline from "@mapbox/polyline";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// // Fix Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // Custom parking icon
// const parkingIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
//   iconSize: [32, 32],
// });

// // Nepal's geographical boundaries
// const NEPAL_BOUNDS = L.latLngBounds(
//   L.latLng(26.3479, 80.0582), // Southwest coordinates
//   L.latLng(30.4469, 88.2015) // Northeast coordinates
// );

// const NEPAL_CENTER = [28.3949, 84.124];

// // Example parking spaces data
// const parkingSpaces = [
//   { id: 1, name: "City Center Parking", position: [27.7172, 85.324] },
//   { id: 2, name: "Mall Parking", position: [27.7105, 85.3256] },
// ];

// // Routing component
// const Routing = ({ start, end }) => {
//   const map = useMap();
//   const routeRef = useRef();

//   useEffect(() => {
//     if (!start || !end) return;

//     // Clear existing route
//     if (routeRef.current) {
//       routeRef.current.remove();
//     }

//     // Fetch route from OSRM API
//     fetch(
//       `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.routes && data.routes[0]) {
//           const decodedPath = polyline.decode(data.routes[0].geometry);
//           const latLngPath = decodedPath.map((point) => [point[0], point[1]]);

//           routeRef.current = L.Routing.control({
//             waypoints: [L.latLng(start), L.latLng(end)],
//             routeWhileDragging: false,
//             show: false, // Hide default routing UI
//             addWaypoints: false,
//           }).addTo(map);

//           // Draw the route
//           L.polyline(latLngPath, { color: "blue", weight: 4 }).addTo(map);
//         }
//       })
//       .catch((err) => console.error("Routing error:", err));

//     return () => {
//       if (routeRef.current) {
//         routeRef.current.remove();
//       }
//     };
//   }, [start, end, map]);

//   return null;
// };

// const Map = () => {
//   const [userPosition, setUserPosition] = useState(null);
//   const [selectedParking, setSelectedParking] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const provider = new OpenStreetMapProvider();

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           const userLocation = L.latLng(latitude, longitude);
//           if (NEPAL_BOUNDS.contains(userLocation)) {
//             setUserPosition([latitude, longitude]);
//           }
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//           setLocationError("Unable to retrieve your location.");
//         }
//       );
//     }
//   }, []);

//   return (
//     <div className="border-2 border-black-500 h-96 m-5 rounded-lg">
//       <MapContainer
//         center={NEPAL_CENTER}
//         zoom={7}
//         style={{ height: "100%", width: "100%" }}
//         minZoom={7}
//         maxBounds={NEPAL_BOUNDS}
//         maxBoundsViscosity={1.0}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* User's current location */}
//         {userPosition && (
//           <Marker position={userPosition}>
//             <Popup>Your Location</Popup>
//           </Marker>
//         )}

//         {/* Parking spaces */}
//         {parkingSpaces.map((parking) => (
//           <Marker
//             key={parking.id}
//             position={parking.position}
//             icon={parkingIcon}
//             eventHandlers={{
//               click: () => setSelectedParking(parking.position),
//             }}
//           >
//             <Popup>
//               <strong>{parking.name}</strong>
//               <button
//                 onClick={() => setSelectedParking(parking.position)}
//                 className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
//               >
//                 Show Route
//               </button>
//             </Popup>
//           </Marker>
//         ))}

//         {/* Show route if parking is selected */}
//         {userPosition && selectedParking && (
//           <Routing start={userPosition} end={selectedParking} />
//         )}
//       </MapContainer>

//       {/* Error message */}
//       {locationError && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
//           {locationError}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Map;

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import polyline from "@mapbox/polyline";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom parking icon
const parkingIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
  iconSize: [32, 32],
});

// Nepal's geographical boundaries
const NEPAL_BOUNDS = L.latLngBounds(
  L.latLng(26.3479, 80.0582), // Southwest coordinates
  L.latLng(30.4469, 88.2015) // Northeast coordinates
);

const NEPAL_CENTER = [28.3949, 84.124];

// Example parking spaces data
const parkingSpaces = [
  { id: 1, name: "City Center Parking", position: [27.7172, 85.324] },
  { id: 2, name: "Mall Parking", position: [27.7105, 85.3256] },
];

// Search Control Component
const SearchControl = ({ provider }) => {
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: "Search for a location in Nepal",
      position: "topright",
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map, provider]);

  return null;
};

// Routing Component
const Routing = ({ start, end }) => {
  const map = useMap();
  const routeRef = useRef();

  useEffect(() => {
    if (!start || !end) return;

    // Clear existing route
    if (routeRef.current) {
      routeRef.current.remove();
    }

    // Zoom to the route bounds
    const bounds = L.latLngBounds([start, end]);
    map.flyToBounds(bounds, { padding: [50, 50] });

    // Fetch route from OSRM API
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes[0]) {
          const decodedPath = polyline.decode(data.routes[0].geometry);
          const latLngPath = decodedPath.map((point) => [point[0], point[1]]);

          routeRef.current = L.Routing.control({
            waypoints: [L.latLng(start), L.latLng(end)],
            routeWhileDragging: false,
            show: false,
            addWaypoints: false,
          }).addTo(map);

          // Draw the route
          L.polyline(latLngPath, { color: "blue", weight: 4 }).addTo(map);
        }
      })
      .catch((err) => console.error("Routing error:", err));

    return () => {
      if (routeRef.current) {
        routeRef.current.remove();
      }
    };
  }, [start, end, map]);

  return null;
};

const Map = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const provider = new OpenStreetMapProvider();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = L.latLng(latitude, longitude);
          if (NEPAL_BOUNDS.contains(userLocation)) {
            setUserPosition([latitude, longitude]);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Unable to retrieve your location.");
        }
      );
    }
  }, []);

  return (
    <div className="border-2 border-black-500 h-96 m-5 rounded-lg">
      <MapContainer
        center={NEPAL_CENTER}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        minZoom={7}
        maxBounds={NEPAL_BOUNDS}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Add Search Control */}
        <SearchControl provider={provider} />

        {/* User's current location */}
        {userPosition && (
          <Marker position={userPosition}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Parking spaces */}
        {parkingSpaces.map((parking) => (
          <Marker
            key={parking.id}
            position={parking.position}
            icon={parkingIcon}
            eventHandlers={{
              click: () => setSelectedParking(parking.position),
            }}
          >
            <Popup>
              <strong>{parking.name}</strong>
              <button
                onClick={() => setSelectedParking(parking.position)}
                className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
              >
                Show Route
              </button>
            </Popup>
          </Marker>
        ))}

        {/* Show route if parking is selected */}
        {userPosition && selectedParking && (
          <Routing start={userPosition} end={selectedParking} />
        )}
      </MapContainer>

      {/* Error message */}
      {locationError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
          {locationError}
        </div>
      )}
    </div>
  );
};

export default Map;
