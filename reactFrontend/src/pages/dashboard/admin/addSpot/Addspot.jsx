// import { useEffect, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMapEvents,
//   Popup,
//   useMap,
// } from "react-leaflet";
// import axios from "axios";
// import Layout from "../../../../components/layout/Layout";
// const Addspot = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     spots: "",
//     latitude: "",
//     longitude: "",
//     phone_no: "",
//     image: "",
//   });

//   // Handle text input changes
//   const handleChange = (e) => {
//     // setFormData({ ...formData, [e.target.name]: e.target.value });

//     if (e.target.name === "image") {
//       setFormData({ ...formData, image: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const [currentLocation, setCurrentLocation] = useState(null);

//   // Blue marker for current location
//   const blueIcon = new L.Icon({
//     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // Default icon image
//     iconSize: [30, 50],
//     iconAnchor: [15, 50],
//     popupAnchor: [1, -40],
//     shadowSize: [41, 41],
//     className: "blue-marker",
//   });

//   // Black marker for parking spot
//   const blackIcon = new L.Icon({
//     iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png", // Default icon image
//     iconSize: [32, 32],
//     className: "black-marker",
//   });

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error getting current location:", error);
//         }
//       );
//     }
//   }, []);
//   const ZoomToLocation = ({ currentLocation }) => {
//     const map = useMap();
//     useEffect(() => {
//       if (currentLocation) {
//         map.flyTo(currentLocation, 15);
//       }
//     }, [currentLocation, map]);
//     return null;
//   };

//   // Function to update lat/lng when map is clicked
//   function LocationPicker() {
//     const map = useMapEvents({
//       click(e) {
//         setFormData({
//           ...formData,
//           latitude: e.latlng.lat,
//           longitude: e.latlng.lng,
//         });
//       },
//     });

//     return formData.latitude && formData.longitude ? (
//       <Marker
//         position={[formData.latitude, formData.longitude]}
//         icon={blackIcon}
//       />
//     ) : null;
//   }

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/parking_spots",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       console.log("Success:", response.data);
//       alert("Parking spot added successfully!");
//       setFormData({
//         name: "",
//         price: "",
//         spots: "",
//         latitude: "",
//         longitude: "",
//         phone_no: "",
//         image: "",
//       });
//     } catch (error) {
//       console.error("Error adding parking spot:", error);
//     }
//   };

//   return (
//     <Layout>
//       {/* larger Screen */}
//       <div className="pt-16 min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="border-2 border-black flex justify-center text-7xl">
//             List Parking Spot
//           </h1>
//           <div className=" bg-gray-50 m-h-screen justify-evenly hidden lg:flex">
//             <form
//               onSubmit={handleSubmit}
//               className="border-4 border-green-600 flex flex-col"
//               method="post"
//               encType="multipart/form-data"
//             >
//               <label>Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 onChange={handleChange}
//                 required
//                 value={formData.name}
//               />
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="number"
//                 name="spots"
//                 placeholder="Spots"
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="string"
//                 name="location"
//                 placeholder="Location"
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="number"
//                 name="phone_no"
//                 placeholder="Phone number"
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="file"
//                 name="image"
//                 // placeholder="Image"
//                 onChange={handleChange}
//                 accept="image/*"
//               />

//               {/* Read-only latitude and longitude inputs */}
//               <input
//                 type="text"
//                 name="latitude"
//                 value={formData.latitude}
//                 readOnly
//                 placeholder="Latitude"
//               />
//               <input
//                 type="text"
//                 name="longitude"
//                 value={formData.longitude}
//                 readOnly
//                 placeholder="Longitude"
//               />

//               <button type="submit">Add Parking Spot</button>
//             </form>
//           </div>

//           {/* Leaflet Map */}
//           <div className="border-2 border-red-500 w-96">
//             <MapContainer
//               center={[27.7172, 85.324]}
//               zoom={13}
//               style={{ height: "400px", width: "100%" }}
//             >
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//               {currentLocation && (
//                 <>
//                   <ZoomToLocation currentLocation={currentLocation} />
//                   <Marker
//                     position={[currentLocation.lat, currentLocation.lng]}
//                     icon={blueIcon}
//                   >
//                     <Popup>Your current location</Popup>
//                   </Marker>
//                 </>
//               )}
//               <LocationPicker />
//             </MapContainer>
//           </div>
//         </div>
//       </div>

//       {/* smaller screen */}
//       <div className=" justify-evenly flex flex-col lg:hidden">
//         <div>
//           <form
//             onSubmit={handleSubmit}
//             className="border-4 border-green-600 flex flex-col"
//           >
//             <label>Name</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               placeholder="Price"
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="number"
//               name="spots"
//               placeholder="Spots"
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="string"
//               name="location"
//               placeholder="Location"
//               onChange={handleChange}
//               required
//             />

//             {/* Read-only latitude and longitude inputs */}
//             <input
//               type="text"
//               name="latitude"
//               value={formData.latitude}
//               readOnly
//               placeholder="Latitude"
//             />
//             <input
//               type="text"
//               name="longitude"
//               value={formData.longitude}
//               readOnly
//               placeholder="Longitude"
//             />

//             <button type="submit">Add Parking Spot</button>
//           </form>
//         </div>

//         {/* Leaflet Map */}
//         <div className="border-2 border-red-500 w-96">
//           <MapContainer
//             center={[27.7172, 85.324]}
//             zoom={13}
//             style={{ height: "400px", width: "100%" }}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             {currentLocation && (
//               <>
//                 <ZoomToLocation currentLocation={currentLocation} />
//                 <Marker
//                   position={[currentLocation.lat, currentLocation.lng]}
//                   icon={blueIcon}
//                 >
//                   <Popup>Your current location</Popup>
//                 </Marker>
//               </>
//             )}
//             <LocationPicker />
//           </MapContainer>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Addspot;

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
  useMap,
} from "react-leaflet";
import { MapPin, Banknote, Car, Phone, Image, MapPinned } from "lucide-react";
import axios from "axios";
import Layout from "../../../../components/layout/Layout";

const AddSpot = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    spots: "",
    latitude: "",
    longitude: "",
    phone_no: "",
    image: "",
    location: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const [currentLocation, setCurrentLocation] = useState(null);

  const blueIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    popupAnchor: [1, -40],
    shadowSize: [41, 41],
    className: "blue-marker",
  });

  const blackIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/parking_spots",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Success:", response.data);
      alert("Parking spot added successfully!");
      setFormData({
        name: "",
        price: "",
        spots: "",
        latitude: "",
        longitude: "",
        phone_no: "",
        image: "",
        location: "",
      });
    } catch (error) {
      console.error("Error adding parking spot:", error);
    }
  };

  return (
    <Layout>
      <div className="pt-16 min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              List Your Parking Spot
            </h1>
            <p className="text-gray-600">
              Fill in the details below and mark your spot on the map
            </p>
          </div>

          <div className="lg:flex lg:gap-8 lg:items-start">
            {/* Form Section */}
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-6 space-y-6"
                method="post"
                encType="multipart/form-data"
              >
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Basic Information
                  </h2>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Spot Name
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter parking spot name"
                      className="input input-bordered w-full"
                      onChange={handleChange}
                      required
                      value={formData.name}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <Banknote className="w-4 h-4" /> Price per Hour
                      </span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Enter price"
                      className="input input-bordered w-full"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <Car className="w-4 h-4" /> Available Spots
                      </span>
                    </label>
                    <input
                      type="number"
                      name="spots"
                      placeholder="Number of available spots"
                      className="input input-bordered w-full"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <MapPinned className="w-4 h-4" /> Location Description
                      </span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Enter location details"
                      className="input input-bordered w-full"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Contact Number
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone_no"
                      placeholder="Enter contact number"
                      className="input input-bordered w-full"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <Image className="w-4 h-4" /> Spot Image
                      </span>
                    </label>
                    <input
                      type="file"
                      name="image"
                      className="file-input file-input-bordered w-full"
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </div>

                  {/* Hidden Coordinates Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Latitude</span>
                      </label>
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        className="input input-bordered w-full bg-gray-50"
                        readOnly
                        placeholder="Click on map"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Longitude</span>
                      </label>
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        className="input input-bordered w-full bg-gray-50"
                        readOnly
                        placeholder="Click on map"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Add Parking Spot
                </button>
              </form>
            </div>

            {/* Map Section */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Mark Location on Map
                </h2>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer
                    center={[27.7172, 85.324]}
                    zoom={13}
                    style={{ height: "600px", width: "100%" }}
                    className="z-0"
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
                <p className="text-sm text-gray-600 mt-2">
                  Click on the map to set the exact location of your parking
                  spot
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddSpot;
