import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
  useMap,
} from "react-leaflet";
import axios from "axios";
const Addspot = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    spots: "",
    latitude: "",
    longitude: "",
  });

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [currentLocation, setCurrentLocation] = useState(null);

  // Blue marker for current location
  const blueIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // Default icon image
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    popupAnchor: [1, -40],
    shadowSize: [41, 41],
    className: "blue-marker",
  });

  // Black marker for parking spot
  const blackIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png", // Default icon image
    iconSize: [32, 32],
    className: "black-marker",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, []);
  const ZoomToLocation = ({ currentLocation }) => {
    const map = useMap();
    useEffect(() => {
      if (currentLocation) {
        map.flyTo(currentLocation, 15);
      }
    }, [currentLocation, map]);
    return null;
  };

  // Function to update lat/lng when map is clicked
  function LocationPicker() {
    const map = useMapEvents({
      click(e) {
        setFormData({
          ...formData,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker
        position={[formData.latitude, formData.longitude]}
        icon={blackIcon}
      />
    ) : null;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/parking_spots",
        formData
      );
      console.log("Success:", response.data);
      alert("Parking spot added successfully!");
      setFormData({
        name: "",
        price: "",
        spots: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      console.error("Error adding parking spot:", error);
    }
  };

  return (
    <div>
      <h1>Add Parking Spot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="spots"
          placeholder="Spots"
          onChange={handleChange}
          required
        />
        <input
          type="string"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />

        {/* Read-only latitude and longitude inputs */}
        <input
          type="text"
          name="latitude"
          value={formData.latitude}
          readOnly
          placeholder="Latitude"
        />
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          readOnly
          placeholder="Longitude"
        />

        <button type="submit">Add Parking Spot</button>
      </form>

      {/* Leaflet Map */}
      <MapContainer
        center={[27.7172, 85.324]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentLocation && (
          <>
            <ZoomToLocation currentLocation={currentLocation} />
            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={blueIcon}
            >
              <Popup>Your current location</Popup>
            </Marker>
          </>
        )}
        <LocationPicker />
      </MapContainer>
    </div>
  );
};

export default Addspot;
