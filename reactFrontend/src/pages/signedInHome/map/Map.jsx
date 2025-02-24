

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

  // let parkingSpaces = [ {
  //   "name": "Downtown Parking Lot",
  //   "location": "123 Main St, City Center",
  //   "price": 5.00,
  //   "spots": 50,
  //   "latitude": 40.712776,
  //   "longitude": -74.005974,
  //   "phone_no": "123-456-7890",
  //   "position": {
  //     "latitude": 40.712776,
  //     "longitude": -74.005974
  //   }
  // },
  // {
  //   "name": "Sunset Garage",
  //   "location": "456 Sunset Blvd, Westside",
  //   "price": 8.50,
  //   "spots": 30,
  //   "latitude": 34.052235,
  //   "longitude": -118.243683,
  //   "phone_no": "987-654-3210",
  //   "position": {
  //     "latitude": 34.052235,
  //     "longitude": -118.243683
  //   }
  // },
  // {
  //   "name": "Airport Parking",
  //   "location": "789 Airport Rd, Near Terminal 1",
  //   "price": 12.00,
  //   "spots": 100,
  //   "latitude": 37.621312,
  //   "longitude": -122.378955,
  //   "phone_no": "555-123-4567",
  //   "position": {
  //     "latitude": 37.621312,
  //     "longitude": -122.378955
  //   }
  // },
  // {
  //   "name": "Green Park Parking",
  //   "location": "101 Greenway, Parkside",
  //   "price": 4.75,
  //   "spots": 20,
  //   "latitude": 51.507351,
  //   "longitude": -0.127758,
  //   "phone_no": "444-888-9999",
  //   "position": {
  //     "latitude": 51.507351,
  //     "longitude": -0.127758
  //   }
  // },
  // {
  //   "name": "Mall Parking",
  //   "location": "500 Mall Avenue, Shopping District",
  //   "price": 7.25,
  //   "spots": 200,
  //   "latitude": 35.689487,
  //   "longitude": 139.691711,
  //   "phone_no": "333-222-1111",
  //   "position": {
  //     "latitude": 35.689487,
  //     "longitude": 139.691711
  //   }
  // }]
  
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         const userLocation = L.latLng(latitude, longitude);
  //         if (NEPAL_BOUNDS.contains(userLocation)) {
  //           setUserPosition([latitude, longitude]);
  //         }
  //       },
  //       (error) => {
  //         console.error("Geolocation error:", error);
  //         setLocationError("Unable to retrieve your location.");
  //       }
  //     );
  //   }
  // }, []);

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/api/parking_spots")
  //     .then((res) => res.json())
  //     .then((data) => setParkingSpaces(data))
  //     .catch((error) => console.error("Error fetching parking spots:", error));
  // }, []);

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         console.log("User location:", latitude, longitude);
  //         setUserPosition([latitude, longitude]);
  //       },
  //       (error) => {
  //         console.error("Geolocation error:", error);
  //         switch (error.code) {
  //           case error.PERMISSION_DENIED:
  //             setLocationError("Location access denied. Please enable location services.");
  //             break;
  //           case error.POSITION_UNAVAILABLE:
  //             setLocationError("Location information is unavailable.");
  //             break;
  //           case error.TIMEOUT:
  //             setLocationError("Location request timed out. Try again.");
  //             break;
  //           default:
  //             setLocationError("An unknown error occurred.");
  //         }
  //       },
  //       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  //     );
  //   } else {
  //     // setLocationError("Geolocation is not supported by your browser.");
  //   }
  // }, []);
  

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
