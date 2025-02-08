//

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import polyline from "@mapbox/polyline";
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
  {
    id: 1,
    name: "City Center Parking",
    position: [27.7172, 85.324],
    price: "$5/hour",
  },
  {
    id: 2,
    name: "Mall Parking",
    position: [27.7105, 85.3256],
    price: "$3/hour",
  },
];

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Function to get nearest parking spaces
const getNearestParkingSpaces = (parkingSpaces, userLat, userLon) => {
  return parkingSpaces
    .map((parking) => ({
      ...parking,
      distance: calculateDistance(
        userLat,
        userLon,
        parking.position[0],
        parking.position[1]
      ),
    }))
    .sort((a, b) => a.distance - b.distance); // Sort by distance (ascending)
};

// Search Control Component
const SearchControl = ({ provider }) => {
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: false, // Disable the blue marker
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

    // Ensure polylineRef.current is initialized as an array
    if (!polylineRef.current) {
      polylineRef.current = [];
    }

    // Clear existing polyline if it exists
    polylineRef.current.forEach((polylineLayer) => {
      map.removeLayer(polylineLayer); // Remove previous polyline from the map
    });
    polylineRef.current = []; // Reset the polyline reference array

    // Fetch route from OSRM API
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes[0]) {
          const decodedPath = polyline.decode(data.routes[0].geometry);
          const latLngPath = decodedPath.map((point) => [point[0], point[1]]);

          // Draw the new route on the map
          const newPolyline = L.polyline(latLngPath, {
            color: "blue",
            weight: 4,
          }).addTo(map);

          // Store the new polyline reference
          polylineRef.current.push(newPolyline);

          // Zoom to the route bounds
          map.flyToBounds(L.latLngBounds(latLngPath), { padding: [50, 50] });
        }
      })
      .catch((err) => console.error("Routing error:", err));

    // Cleanup function to remove polyline when component unmounts or dependencies change
    return () => {
      if (polylineRef.current) {
        polylineRef.current.forEach((polylineLayer) => {
          map.removeLayer(polylineLayer); // Remove from map
        });
        polylineRef.current = []; // Reset the reference array
        console.log("Polylines removed on cleanup");
      }
    };
  }, [start, end, map]); // Re-run if start or end changes

  return null;
};

// Zoom to User's Location Component
const ZoomToLocation = ({ userPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (userPosition) {
      map.flyTo(userPosition, 15); // Zoom to level 15
    }
  }, [userPosition, map]);

  return null;
};

const Map = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [parkingSpace, setParkingSpace] = useState([]);
  const provider = new OpenStreetMapProvider();
  const polylineRef = useRef(null);
  // const [searchLocation, setSearchLocation] = useState("");

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
      .then((data) => {
        if (data) {
          setParkingSpace(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching parking spots:", error);
      });
  }, []);

  const handleCancelBtn = () => {
    // if (polylineRef.current) {
    //   polylineRef.current.remove();
    //   polylineRef.current = null;
    // }
    // setShowRoute(false);
    // setSelectedParking(null);
    console.log("button cancel");
  };

  // Get nearest parking spaces
  const nearestParkingSpaces = userPosition
    ? getNearestParkingSpaces(
        parkingSpace,
        userPosition[0],
        userPosition[1]
      ).slice(0, 5) // Show top 5 nearest parking spaces
    : [];

  const [sortBy, setSortBy] = useState("distance");
  console.log(sortBy);
  return (
    <div>
      {/* Desktop Screen */}
      <div className="hidden lg:flex h-screen">
        <div className="border-2 border-red-500 h-full w-2/3 mt-10 rounded-lg fixed ">
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

            <SearchControl provider={provider} />

            {userPosition && (
              <Marker position={userPosition}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {userPosition && <ZoomToLocation userPosition={userPosition} />}

            {parkingSpace.map((parking) => (
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
                  <p>{parking.price}</p>
                  <div className="border-2 border-red-400">
                    <button
                      onClick={() => {
                        setSelectedParking(parking.position);
                        setShowRoute(true);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
                    >
                      Show Route
                    </button>
                    <button
                      onClick={handleCancelBtn}
                      className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                    >
                      Cancel Route
                    </button>
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

          {locationError && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
              {locationError}
            </div>
          )}
        </div>

        {/* Table for nearest parking spaces */}
        <div className="border border-yellow-500 bg-gray-200 ml-auto w-[490px] h-screen  mt-10">
          <div className="fixed bg-gray-100 border border-black z-10 w-[490px]">
            {/* <h2 className="text-xl font-bold mb-4 flex justify-center">
              Parking Spaces
            </h2> */}
            <div className="flex justify-end p-2">
              <p className="text-xl mx-5">Sort By:</p>
              <button
                onClick={() => setSortBy("distance")}
                className={`btn mx-2  ${
                  sortBy === "distance"
                    ? "btn-accent"
                    : "btn-outline btn-accent"
                }`}
              >
                Distance
              </button>
              <button
                onClick={() => setSortBy("price")}
                // className="btn btn-outline btn-success"
                className={`btn  ${
                  sortBy === "price" ? "btn-primary" : "btn-outline btn-primary"
                }`}
              >
                Price
              </button>
            </div>
          </div>
          <div className="border-2 border-green-500 mt-15">
            {sortBy === "distance"
              ? nearestParkingSpaces.map((parking) => (
                  <div key={parking.id}>
                    <div className="collapse collapse-arrow bg-base-200 my-4">
                      <input
                        type="radio"
                        name="my-accordion-1"
                        defaultChecked
                      />
                      <div className="flex justify-between collapse-title text-xl font-medium">
                        <div>{parking.name}</div>
                        <div className="py-2 px-4 border-b">
                          {parking.distance.toFixed(2)}km
                        </div>
                      </div>
                      <div className="collapse-content">
                        <p>hello</p>

                        <div>
                          <button
                            onClick={() => {
                              setSelectedParking(parking.position);
                              setShowRoute(true);
                            }}
                            className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
                          >
                            Show Route
                          </button>
                          {/* <button
                            onClick={handleCancelBtn}
                            className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                          >
                            Cancel Route
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : parkingSpace
                  .slice()
                  .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                  .map((parking) => (
                    <div key={parking.id}>
                      <div className="collapse collapse-arrow bg-base-200 my-4">
                        <input
                          type="radio"
                          name="my-accordion-1"
                          defaultChecked
                        />
                        <div className="flex justify-between collapse-title text-xl font-medium">
                          <div>{parking.name}</div>
                          <div className="py-2 px-4 border-b">
                            Rs {parseFloat(parking.price).toFixed(2)}/hr
                          </div>
                        </div>
                        <div className="collapse-content">
                          <p>Price based listing</p>
                          <div>
                            <button
                              onClick={() => {
                                setSelectedParking(parking.position);
                                setShowRoute(true);
                              }}
                              className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
                            >
                              Show Route
                            </button>
                            <button
                              onClick={handleCancelBtn}
                              className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                            >
                              Cancel Route
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
          </div>
        </div>
      </div>

      {/* Mobile Screen */}
      {/* <div className="lg:hidden flex flex-col h-96 w-7xl">
        <div className="border-2 border-red-500 h-full w-2/3 mt-10 rounded-lg z-0 ">
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

            <SearchControl provider={provider} />

            {userPosition && (
              <Marker position={userPosition}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {userPosition && <ZoomToLocation userPosition={userPosition} />}

            {parkingSpace.map((parking) => (
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
                  <p>{parking.price}</p>
                  <div className="border-2 border-red-400">
                    <button
                      onClick={() => {
                        setSelectedParking(parking.position);
                        setShowRoute(true);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
                    >
                      Show Route
                    </button>
                    <button
                      onClick={handleCancelBtn}
                      className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                    >
                      Cancel Route
                    </button>
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

          {locationError && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
              {locationError}
            </div>
          )}
        </div> */}

      {/* Table for nearest parking spaces */}
      {/* <div className="border border-yellow-500 bg-gray-200 ml-auto w-[490px] h-screen  mt-10">
          <div className="fixed bg-gray-100 border border-black z-10 w-[490px]">
            <h2 className="text-xl font-bold mb-4 ">Nearest Parking Spaces</h2>
          </div>
          <div className="border-2 border-green-500 mt-10">
            {nearestParkingSpaces.map((parking) => (
              <div key={parking.id}>
                <div className="collapse collapse-arrow bg-base-200 my-4">
                  <input type="radio" name="my-accordion-1" defaultChecked />
                  <div className="flex justify-between collapse-title text-xl font-medium">
                    <div>{parking.name}</div>
                    <div className="py-2 px-4 border-b">
                      {parking.distance.toFixed(2)}km
                    </div>
                  </div>
                  <div className="collapse-content">
                    <p>hello</p>

                    <div>
                      <button
                        onClick={() => {
                          setSelectedParking(parking.position);
                          setShowRoute(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
                      >
                        Show Route
                      </button>
                      <button
                        onClick={handleCancelBtn}
                        className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                      >
                        Cancel Route
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default Map;
