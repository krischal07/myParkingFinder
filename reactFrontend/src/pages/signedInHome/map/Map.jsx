// import { useState, useEffect, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-geosearch/dist/geosearch.css";
// import polyline from "@mapbox/polyline";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import {
//   FaCar,
//   FaMap,
//   FaMapMarked,
//   FaMapMarkedAlt,
//   FaMapMarker,
//   FaMapMarkerAlt,
//   FaMarker,
//   FaPhone,
//   FaPhoneAlt,
// } from "react-icons/fa";

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

// // Function to calculate distance between two points using Haversine formula
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius of the Earth in km
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// };

// // Function to get nearest parking spaces
// const getNearestParkingSpaces = (parkingSpaces, userLat, userLon) => {
//   return parkingSpaces
//     .map((parking) => ({
//       ...parking,
//       distance: calculateDistance(
//         userLat,
//         userLon,
//         parking.position[0],
//         parking.position[1]
//       ),
//     }))
//     .sort((a, b) => a.distance - b.distance); // Sort by distance (ascending)
// };

// // Search Control Component
// const SearchControl = ({ provider }) => {
//   const map = useMap();

//   useEffect(() => {
//     const searchControl = new GeoSearchControl({
//       provider,
//       style: "bar",
//       autoComplete: true,
//       autoCompleteDelay: 250,
//       showMarker: false, // Disable the blue marker
//       retainZoomLevel: false,
//       animateZoom: true,
//       keepResult: true,
//       searchLabel: "Search for Parking Space",
//       position: "topright",
//     });

//     map.addControl(searchControl);
//     return () => map.removeControl(searchControl);
//   }, [map, provider]);

//   return null;
// };

// const Routing = ({ start, end, polylineRef }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!start || !end) return;

//     // Ensure polylineRef.current is initialized as an array
//     if (!polylineRef.current) {
//       polylineRef.current = [];
//     }

//     // Clear existing polyline if it exists
//     polylineRef.current.forEach((polylineLayer) => {
//       map.removeLayer(polylineLayer); // Remove previous polyline from the map
//     });
//     polylineRef.current = []; // Reset the polyline reference array

//     // Fetch route from OSRM API
//     fetch(
//       `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.routes && data.routes[0]) {
//           const decodedPath = polyline.decode(data.routes[0].geometry);
//           const latLngPath = decodedPath.map((point) => [point[0], point[1]]);

//           // Draw the new route on the map
//           const newPolyline = L.polyline(latLngPath, {
//             color: "blue",
//             weight: 4,
//           }).addTo(map);

//           // Store the new polyline reference
//           polylineRef.current.push(newPolyline);

//           // Zoom to the route bounds
//           map.flyToBounds(L.latLngBounds(latLngPath), { padding: [50, 50] });
//         }
//       })
//       .catch((err) => console.error("Routing error:", err));

//     // Cleanup function to remove polyline when component unmounts or dependencies change
//     return () => {
//       if (polylineRef.current) {
//         polylineRef.current.forEach((polylineLayer) => {
//           map.removeLayer(polylineLayer); // Remove from map
//         });
//         polylineRef.current = []; // Reset the reference array
//         console.log("Polylines removed on cleanup");
//       }
//     };
//   }, [start, end, map]); // Re-run if start or end changes

//   return null;
// };

// // Zoom to User's Location Component
// const ZoomToLocation = ({ userPosition }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (userPosition) {
//       map.flyTo(userPosition, 15); // Zoom to level 15
//     }
//   }, [userPosition, map]);

//   return null;
// };

// const Map = () => {
//   const [userPosition, setUserPosition] = useState(null);
//   const [selectedParking, setSelectedParking] = useState(null);
//   const [accordianParking, setAccordianParking] = useState(null);
//   const [showRoute, setShowRoute] = useState(false);
//   const [locationError, setLocationError] = useState(null);
//   const [parkingSpace, setParkingSpace] = useState([]);
//   const provider = new OpenStreetMapProvider();
//   const polylineRef = useRef(null);

//   // const [searchLocation, setSearchLocation] = useState("");
//   console.log("selectedParking", selectedParking);
//   console.log("accordianParking", accordianParking);
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

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/parking_spots")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data) {
//           console.log(data);
//           setParkingSpace(data);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching parking spots:", error);
//       });
//   }, []);

//   useEffect(() => {
//     if (userPosition) {
//       const newParkingSpace = parkingSpace.map((parking) => {
//         const distance = calculateDistance(
//           userPosition[0],
//           userPosition[1],
//           parking.position[0],
//           parking.position[1]
//         );
//         return {
//           ...parking,
//           distance: distance.toFixed(2),
//         };
//       });
//       setParkingSpace(newParkingSpace);
//     }
//   }, [userPosition]);

//   // Get nearest parking spaces
//   const nearestParkingSpaces = userPosition
//     ? getNearestParkingSpaces(
//         parkingSpace,
//         userPosition[0],
//         userPosition[1]
//       ).slice(0, 5) // Show top 5 nearest parking spaces
//     : [];

//   console.log("nearestParkingSpaces", nearestParkingSpaces);

//   const [sortBy, setSortBy] = useState("distance");
//   console.log(sortBy);
//   return (
//     <div>
//       {/* Desktop Screen */}
//       <div className="hidden lg:flex h-screen">
//         {/* Map Start */}
//         <div className=" h-full  w-[1040px] mt-10 rounded-lg fixed border-2 border-black ">
//           <MapContainer
//             center={NEPAL_CENTER}
//             zoom={7}
//             style={{ height: "100%", width: "100%" }}
//             minZoom={7}
//             maxBounds={NEPAL_BOUNDS}
//             maxBoundsViscosity={1.0}
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />

//             <SearchControl provider={provider} />

//             {userPosition && (
//               <Marker position={userPosition}>
//                 <Popup>Your Location</Popup>
//               </Marker>
//             )}

//             {userPosition && <ZoomToLocation userPosition={userPosition} />}

//             {parkingSpace.map((parking) => (
//               <Marker
//                 key={parking.id}
//                 position={parking.position}
//                 icon={parkingIcon}
//                 eventHandlers={{
//                   click: () => {
//                     setSelectedParking(parking.position);
//                     if (userPosition) {
//                       const distance = calculateDistance(
//                         userPosition[0],
//                         userPosition[1],
//                         parking.position[0],
//                         parking.position[1]
//                       );
//                       setAccordianParking({
//                         ...parking,
//                         distance: distance.toFixed(2),
//                       });
//                     }
//                     // setAccordianParking(parking);
//                   },
//                 }}
//               >
//                 <Popup>
//                   <strong className="text-3xl">{parking.name}</strong>
//                   {/* <p>{parking.price}</p> */}
//                   {/* <div className="border-2 border-red-400">
//                     <button
//                       onClick={() => {
//                         setSelectedParking(parking.position);
//                         setShowRoute(true);
//                       }}
//                       className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
//                     >
//                       Show Route
//                     </button>
//                   </div> */}
//                 </Popup>
//               </Marker>
//             ))}

//             {userPosition && selectedParking && showRoute && (
//               <Routing
//                 start={userPosition}
//                 end={selectedParking}
//                 polylineRef={polylineRef}
//               />
//             )}
//           </MapContainer>

//           {locationError && (
//             <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
//               {locationError}
//             </div>
//           )}
//         </div>

//         {/* Table for nearest parking spaces */}
//         <div className=" bg-white mx-5 ml-auto w-[390px] h-screen  mt-10">
//           <div className="fixed bg-white z-10 w-[390px]">
//             {/* <h2 className="text-xl font-bold mb-4 flex justify-center">
//               Parking Spaces
//             </h2> */}
//             <div className="flex justify-end p-2">
//               <p className="text-xl font-semibold mx-5">Sort By:</p>
//               <button
//                 onClick={() => setSortBy("distance")}
//                 className={`btn mx-2  ${
//                   sortBy === "distance"
//                     ? "btn-accent"
//                     : "btn-outline btn-accent"
//                 }`}
//               >
//                 Distance
//               </button>
//               <button
//                 onClick={() => setSortBy("price")}
//                 // className="btn btn-outline btn-success"
//                 className={`btn  ${
//                   sortBy === "price" ? "btn-primary" : "btn-outline btn-primary"
//                 }`}
//               >
//                 Price
//               </button>
//             </div>
//           </div>
//           <div className=" mt-15">
//             {accordianParking ? (
//               <div key={accordianParking.id}>
//                 <div className="collapse collapse-arrow bg-base-200 my-4">
//                   <input type="radio" name="my-accordion-1" defaultChecked />
//                   <div className="flex justify-between collapse-title text-xl font-medium">
//                     <div>{accordianParking.name}</div>
//                     <div className="py-2 px-4 ">
//                       {accordianParking.distance}km
//                     </div>
//                   </div>
//                   <div className="collapse-content">
//                     <div className="flex justify-center">
//                       <p className="text-4xl text-green-700">
//                         Rs.
//                         <span className="font-bold">
//                           {accordianParking.price}
//                         </span>
//                         <span className="text-black text-2xl">/hr</span>
//                       </p>
//                     </div>
//                     <div className="flex">
//                       <FaCar />
//                       {accordianParking.spots} spots
//                     </div>
//                     <div className="flex justify-center">
//                       <button
//                         onClick={() => {
//                           setSelectedParking(accordianParking.position);
//                           setShowRoute(true);
//                         }}
//                         className="w-64 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white p-2 mt-2 rounded"
//                       >
//                         Get Directions
//                       </button>
//                     </div>
//                     <img
//                       width="100px"
//                       height="200px"
//                       src={accordianParking.image}
//                     />
//                     <div className="flex">
//                       <FaMapMarkerAlt />
//                       {accordianParking.location}
//                     </div>
//                     <FaPhone />
//                     {accordianParking.phone_no}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               ""
//             )}
//             {sortBy === "distance"
//               ? nearestParkingSpaces.map((parking) => {
//                   console.log("parkong distance", parking);
//                   return (
//                     <div key={parking.id}>
//                       <div className="collapse collapse-arrow bg-base-200 my-4">
//                         <input
//                           type="radio"
//                           name="my-accordion-1"
//                           defaultChecked
//                         />
//                         <div className="flex justify-between collapse-title text-xl font-medium">
//                           <div>{parking.name}</div>
//                           <div className="py-2 px-4 ">
//                             {parking.distance.toFixed(2)}km
//                           </div>
//                         </div>
//                         <div className="collapse-content">
//                           <div className="flex justify-center">
//                             <p className="text-4xl text-green-700">
//                               Rs.
//                               <span className="font-bold">{parking.price}</span>
//                               <span className="text-black text-2xl">/hr</span>
//                             </p>
//                           </div>
//                           <div className="flex">
//                             <FaCar />
//                             {parking.spots} spots
//                           </div>

//                           <div className="flex my-2 justify-items-start ">
//                             <FaMapMarkerAlt />
//                             <span className="mx-2">{parking.location}</span>
//                           </div>
//                           <div className="flex">
//                             <FaPhoneAlt height="200px" />
//                             <span className="mx-2">{parking.phone_no}</span>
//                           </div>
//                           <img
//                             width="100px"
//                             height="200px"
//                             src={parking.image}
//                           />
//                           <div className="flex justify-center">
//                             <button
//                               onClick={() => {
//                                 setSelectedParking(parking.position);
//                                 setShowRoute(true);
//                               }}
//                               className="w-64 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white p-2 mt-2 rounded"
//                             >
//                               Get Directions
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               : parkingSpace
//                   .slice()
//                   .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
//                   .map((parking) => (
//                     <div key={parking.id}>
//                       <div className="collapse collapse-arrow bg-base-200 my-4">
//                         <input
//                           type="radio"
//                           name="my-accordion-1"
//                           defaultChecked
//                         />
//                         <div className="flex justify-between collapse-title text-xl font-medium">
//                           <div>{parking.name}</div>
//                           <div className="py-2 px-4 ">
//                             Rs {parseFloat(parking.price).toFixed(2)}/hr
//                           </div>
//                         </div>
//                         {/* <div className="collapse-content">
//                           <p>Price based listing</p>
//                           <div>
//                             <button
//                               onClick={() => {
//                                 setSelectedParking(parking.position);
//                                 setShowRoute(true);
//                               }}
//                               className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
//                             >
//                               Show Route
//                             </button>
//                             <button
//                               onClick={handleCancelBtn}
//                               className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
//                             >
//                               Cancel Route
//                             </button>
//                           </div>
//                         </div> */}
//                         <div className="collapse-content">
//                           <div className="flex justify-center">
//                             <p className="text-4xl text-info">
//                               <span className="font-bold">
//                                 {parking.distance}
//                               </span>
//                               <span className="text-black text-2xl">/km</span>
//                             </p>
//                           </div>
//                           <div className="flex">
//                             <FaCar />
//                             {parking.spots} spots
//                           </div>
//                           <div className="flex justify-center">
//                             <button
//                               onClick={() => {
//                                 setSelectedParking(parking.position);
//                                 setShowRoute(true);
//                               }}
//                               className="w-64 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white p-2 mt-2 rounded"
//                             >
//                               Get Directions
//                             </button>
//                           </div>
//                           <img
//                             width="100px"
//                             height="200px"
//                             src={parking.image}
//                           />
//                           <div className="flex">
//                             <FaMapMarkerAlt />
//                             {parking.location}
//                           </div>
//                           <FaPhone />
//                           {parking.phone_no}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Map;

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import {
  Map as MapIcon,
  Navigation,
  Car,
  Phone,
  MapPin,
  DollarSign,
} from "lucide-react";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
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

const parkingIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
  iconSize: [32, 32],
});

const NEPAL_BOUNDS = L.latLngBounds(
  L.latLng(26.3479, 80.0582),
  L.latLng(30.4469, 88.2015)
);

const NEPAL_CENTER = [28.3949, 84.124];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const SearchControl = ({ provider }) => {
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: false,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: "Search for Parking Space",
      position: "topright",
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map, provider]);

  return null;
};

const Routing = ({ start, end, polylineRef }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    if (!polylineRef.current) {
      polylineRef.current = [];
    }

    polylineRef.current.forEach((polylineLayer) => {
      map.removeLayer(polylineLayer);
    });
    polylineRef.current = [];

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes?.[0]) {
          const decodedPath = polyline.decode(data.routes[0].geometry);
          const latLngPath = decodedPath.map((point) => [point[0], point[1]]);

          const newPolyline = L.polyline(latLngPath, {
            color: "blue",
            weight: 4,
          }).addTo(map);

          polylineRef.current.push(newPolyline);
          map.flyToBounds(L.latLngBounds(latLngPath), { padding: [50, 50] });
        }
      })
      .catch((err) => console.error("Routing error:", err));

    return () => {
      polylineRef.current?.forEach((polylineLayer) => {
        map.removeLayer(polylineLayer);
      });
      polylineRef.current = [];
    };
  }, [start, end, map]);

  return null;
};

const ZoomToLocation = ({ userPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (userPosition) {
      map.flyTo(userPosition, 15);
    }
  }, [userPosition, map]);

  return null;
};

const ParkingCard = ({ parking, onDirectionsClick, isSelected, distance }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 mb-4 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{parking.name}</h3>
        <span className="text-sm text-gray-600">{distance?.toFixed(2)} km</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-green-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="font-medium">Rs. {parking.price}/hr</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Car className="w-4 h-4 mr-2" />
          <span>{parking.spots} spots available</span>
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{parking.location}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          <span>{parking.phone_no}</span>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => onDirectionsClick(parking)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </button>
      </div>
    </div>
  );
};

const Map = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [sortBy, setSortBy] = useState("distance");
  const provider = new OpenStreetMapProvider();
  const polylineRef = useRef(null);

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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/parking_spots")
      .then((res) => res.json())
      .then((data) => setParkingSpaces(data))
      .catch((error) => console.error("Error fetching parking spots:", error));
  }, []);

  const handleDirectionsClick = (parking) => {
    setSelectedParking(parking.position);
    setShowRoute(true);
  };

  const sortedParkingSpaces = [...parkingSpaces].sort((a, b) => {
    if (sortBy === "distance" && userPosition) {
      const distanceA = calculateDistance(
        userPosition[0],
        userPosition[1],
        a.position[0],
        a.position[1]
      );
      const distanceB = calculateDistance(
        userPosition[0],
        userPosition[1],
        b.position[0],
        b.position[1]
      );
      return distanceA - distanceB;
    }
    return parseFloat(a.price) - parseFloat(b.price);
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-2/3 mt-4 p-6">
        <div className="h-full rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={NEPAL_CENTER}
            zoom={7}
            className="h-full w-full"
            minZoom={7}
            maxBounds={NEPAL_BOUNDS}
            maxBoundsViscosity={1.0}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SearchControl provider={provider} />

            {userPosition && (
              <Marker position={userPosition}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {userPosition && <ZoomToLocation userPosition={userPosition} />}

            {parkingSpaces.map((parking) => (
              <Marker
                key={parking.id}
                position={parking.position}
                icon={parkingIcon}
                eventHandlers={{
                  click: () => handleDirectionsClick(parking),
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{parking.name}</h3>
                    <p className="text-sm text-gray-600">{parking.location}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {userPosition && selectedParking && showRoute && (
              <Routing
                start={userPosition}
                end={selectedParking}
                polylineRef={polylineRef}
              />
            )}
          </MapContainer>
        </div>
      </div>

      <div className="w-1/3 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Parking Spaces</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("distance")}
                className={`px-3 py-1 rounded-md ${
                  sortBy === "distance"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Distance
              </button>
              <button
                onClick={() => setSortBy("price")}
                className={`px-3 py-1 rounded-md ${
                  sortBy === "price"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Price
              </button>
            </div>
          </div>

          {locationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {locationError}
            </div>
          )}

          <div className="space-y-4">
            {sortedParkingSpaces.map((parking) => (
              <ParkingCard
                key={parking.id}
                parking={parking}
                onDirectionsClick={handleDirectionsClick}
                isSelected={selectedParking === parking.position}
                distance={
                  userPosition
                    ? calculateDistance(
                        userPosition[0],
                        userPosition[1],
                        parking.position[0],
                        parking.position[1]
                      )
                    : null
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
