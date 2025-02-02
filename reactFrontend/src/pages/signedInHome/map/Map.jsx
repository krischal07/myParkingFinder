import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import polyline from "@mapbox/polyline";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

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

const parkingSpaces = [
  { id: 1, name: "City Center Parking", position: [27.7172, 85.324] },
  { id: 2, name: "Mall Parking", position: [27.7105, 85.3256] },
];

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
      searchLabel: "Search for a location in Nepal",
      position: "topright",
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map, provider]);
  return null;
};

const Routing = ({ start, end }) => {
  const map = useMap();
  const polylineRef = useRef(null);
  useEffect(() => {
    if (!start || !end) return;

    if (polylineRef.current) {
      polylineRef.current.remove();
      //   polylineRef.current = null;
      console.log("Existing polyline removed");
      //   polylineRef.current = null;
    }

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes[0]) {
          const decodedPath = polyline.decode(data.routes[0].geometry);
          const latLngPath = decodedPath.map((point) => [point[0], point[1]]);
          polylineRef.current = L.polyline(latLngPath, {
            color: "blue",
            weight: 4,
          }).addTo(map);
          map.flyToBounds(L.latLngBounds(latLngPath), { padding: [50, 50] });
        }

        // polylineRef.current.remove();
        console.log("ploylineref", polylineRef.current);
      })
      .catch((err) => console.error("Routing error:", err));

    return () => {
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
        console.log("insinde cancel reutn");
        console.log("Polyline reomved inside here!");
      }
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

// const [parkingSpace, setParkingSpace] = useState([]);

// useEffect(() => {
//   fetch("http://127.0.0.1:8000/api/parking_spots")
//     .then((res) => res.json())
//     .then((data) => setParkingSpace(data));
//   console.log("parkingSpace");
// }, []);

const Map = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const provider = new OpenStreetMapProvider();
  console.log("showRoute", showRoute);
  console.log("selectedParking", selectedParking);
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
  const handleCancelBtn = () => {
    setShowRoute(false);
    setSelectedParking(null);
  };

  const [parkingSpace, setParkingSpace] = useState([]); // Default is an empty array

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/parking_spots")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setParkingSpace(data); // Only set data if it's not null or undefined
          console.log(parkingSpace);
        }
      })
      .catch((error) => {
        console.error("Error fetching parking spots:", error);
      });
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
            showRoute={showRoute}
          />
        )}
      </MapContainer>

      {locationError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
          {locationError}
        </div>
      )}
    </div>
  );
};

export default Map;
