import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

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

// Nepal's geographical boundaries
const NEPAL_BOUNDS = L.latLngBounds(
  L.latLng(26.3479, 80.0582), // Southwest coordinates
  L.latLng(30.4469, 88.2015) // Northeast coordinates
);

// Center of Nepal
const NEPAL_CENTER = [28.3949, 84.124];

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
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map, provider]);

  return null;
};

const AdminMap = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null); // New state for clicked location
  const [parkingSpaces, setParkingSpaces] = useState([
    // State for parking data
    // Initial data (optional)
  ]);
  const provider = new OpenStreetMapProvider();

  // Add click handler to the map
  const HandleMapClick = () => {
    const map = useMap();
    useEffect(() => {
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation([lat, lng]); // Store clicked coordinates
      });
    }, [map]);
    return null;
  };

  // Form to save parking space details
  const AddParkingForm = () => (
    <div className="absolute top-20 left-4 z-[1000] bg-white p-4 rounded shadow-lg">
      <h3 className="font-bold mb-2">Add Parking Space</h3>
      {selectedLocation && (
        <p className="text-sm mb-2">
          Coordinates: {selectedLocation[0].toFixed(4)},{" "}
          {selectedLocation[1].toFixed(4)}
        </p>
      )}
      <input
        type="text"
        placeholder="Parking Name"
        className="border p-2 mb-2 w-full"
      />
      <textarea placeholder="Description" className="border p-2 mb-2 w-full" />
      <button
        onClick={() => {
          // Add to parkingSpaces array
          setParkingSpaces([
            ...parkingSpaces,
            {
              id: Date.now(),
              name: "New Parking",
              description: "Description here",
              position: selectedLocation,
            },
          ]);
          setSelectedLocation(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Parking
      </button>
    </div>
  );

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
        {/* Add click handler component */}
        <HandleMapClick />

        {/* Show temporary marker for clicked location */}
        {selectedLocation && (
          <Marker position={selectedLocation}>
            <Popup>Temporary Location</Popup>
          </Marker>
        )}

        {/* Rest of the map code */}
      </MapContainer>

      {/* Show the parking form */}
      <AddParkingForm />
    </div>
  );
};

export default AdminMap;
