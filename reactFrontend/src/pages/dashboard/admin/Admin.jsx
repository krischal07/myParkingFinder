// import React, { useEffect, useState } from "react";
// import Layout from "../../../components/layout/Layout";
// import Table from "./Table";
// import { Link } from "react-router-dom";

// const Admin = () => {
//   console.log("we in admin now");
//   const [parkingSpots, setParkingSpots] = useState([]);
//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/parking_spots")
//       .then((res) => res.json())
//       .then((data) => setParkingSpots(data));
//   }, []);
//   // console.log(places);

//   return (
//     <div>
//       <Layout>
//         <h1 className="text-3xl">Dashboard</h1>
//         <Link to="/addspot">
//           <button className="btn btn-primary">Add Spot</button>
//         </Link>
//         <Table parkingSpots={parkingSpots} setParkingSpots={setParkingSpots} />
//       </Layout>
//     </div>
//   );
// };

// export default Admin;

// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Users, Car, Circle, DollarSign } from "lucide-react";
// import axios from "axios";
// import { useUser, useAuth, useOrganization } from "@clerk/clerk-react";

// const AdminDashboard = () => {
//   const [parkingSpots, setParkingSpots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // const { user } = useUser();
//   // const { users } = useUsers();

//   // Fetch parking spots data
//   useEffect(() => {
//     const fetchParkingSpots = async () => {
//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/api/parking_spots"
//         );
//         setParkingSpots(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching parking spots:", error);
//         setLoading(false);
//       }
//     };

//     fetchParkingSpots();
//   }, []);

//   // Calculate total spots and total revenue potential
//   const totalSpots = parkingSpots.reduce((acc, spot) => acc + spot.spots, 0);
//   const totalRevenue = parkingSpots.reduce(
//     (acc, spot) => acc + spot.price * spot.spots,
//     0
//   );

//   // Transform parking spots data for charts
//   const spotsByLocation = parkingSpots.map((spot) => ({
//     name: spot.location,
//     spots: spot.spots,
//     revenue: spot.price * spot.spots,
//   }));

//   const priceDistribution = parkingSpots.map((spot) => ({
//     name: spot.name,
//     value: spot.price,
//   }));

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

//   const stats = {
//     // totalUsers: users?.length || 0,
//     // activeUsers: users?.filter((u) => u.lastSignInAt)?.length || 0,
//     totalSpots: totalSpots,
//     totalRevenue: totalRevenue,
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="loading loading-spinner loading-lg"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header with User Info */}
//         {/* <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Analytics Dashboard
//           </h1>
//           {user && (
//             <div className="flex items-center space-x-2">
//               <img
//                 src={user.imageUrl}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full"
//               />
//               <span className="font-medium">{user.fullName}</span>
//             </div>
//           )}
//         </div> */}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <Users className="h-10 w-10 text-blue-500" />
//               <div className="ml-4">
//                 <p className="text-sm text-gray-500">Total Users</p>
//                 <p className="text-2xl font-bold">{stats.totalUsers}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <Circle className="h-10 w-10 text-green-500" />
//               <div className="ml-4">
//                 <p className="text-sm text-gray-500">Active Users</p>
//                 <p className="text-2xl font-bold">{stats.activeUsers}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <Car className="h-10 w-10 text-purple-500" />
//               <div className="ml-4">
//                 <p className="text-sm text-gray-500">Total Spots</p>
//                 <p className="text-2xl font-bold">{stats.totalSpots}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <DollarSign className="h-10 w-10 text-yellow-500" />
//               <div className="ml-4">
//                 <p className="text-sm text-gray-500">Potential Revenue</p>
//                 <p className="text-2xl font-bold">${stats.totalRevenue}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Spots by Location Chart */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">Spots by Location</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={spotsByLocation}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="spots" fill="#8884d8" name="Number of Spots" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Revenue by Location Chart */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">Revenue by Location</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={spotsByLocation}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="revenue"
//                     stroke="#82ca9d"
//                     strokeWidth={2}
//                     name="Potential Revenue"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Price Distribution */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">Price Distribution</h2>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={priceDistribution}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, value }) => `${name}: $${value}`}
//                     outerRadius={100}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {priceDistribution.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Parking Spots Table */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">Parking Spots</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                       Location
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                       Price
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                       Spots
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {parkingSpots.map((spot) => (
//                     <tr key={spot.id}>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {spot.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         {spot.location}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         ${spot.price}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         {spot.spots}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MapPin, DollarSign, Car, Phone, MapPinHouse } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import axios from "axios";

const AdminDashboard = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/parking_spots"
        );
        setParkingSpots(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parking spots:", error);
        setLoading(false);
      }
    };

    fetchParkingSpots();
  }, []);

  const [selectedSpotId, setSelectedSpotId] = useState(null);
  console.log(selectedSpotId);
  const handleDeleteParkingSpot = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/parking_spots/${id}`);
      setParkingSpots((prevSpaces) =>
        prevSpaces.filter((spot) => spot.id != id)
      );
    } catch (error) {
      console.error("Error deleteing parking spots", error);
    } finally {
      setSelectedSpotId(null);
      document.getElementById("my_modal_2").close();
    }
  };

  console.log(parkingSpots, "ps");

  // Calculate statistics
  const totalLocation = parkingSpots.length;
  // console.log(totalParking, "tp");
  const totalSpots = parkingSpots.reduce((acc, spot) => acc + spot.spots, 0);
  const totalRevenue = parkingSpots.reduce(
    (acc, spot) => acc + spot.price * spot.spots,
    0
  );
  const averagePrice = parkingSpots.length
    ? parkingSpots.reduce((acc, spot) => acc + spot.price, 0) /
      parkingSpots.length
    : 0;

  // Chart data transformations
  const locationData = parkingSpots.map((spot) => ({
    name: spot.name,
    spots: spot.spots,
    revenue: spot.price * spot.spots,
  }));

  const priceData = parkingSpots.map((spot) => ({
    name: spot.name,
    price: spot.price,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen  bg-gray-50 p-17">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Parking Spots Analytics
          </h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Car className="h-10 w-10 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Parking Spots</p>
                  <p className="text-2xl font-bold">{totalSpots}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <MapPinHouse className="h-10 w-10 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Location</p>
                  <p className="text-2xl font-bold">{totalLocation}</p>
                </div>
              </div>
            </div>

            {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Potential Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue}</p>
              </div>
            </div>
          </div> */}

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-10 w-10 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Average Price</p>
                  <p className="text-2xl font-bold">
                    Rs {averagePrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spots Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Spots Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="spots"
                      fill="#8884d8"
                      name="Number of Spots"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Potential */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Revenue Potential by Location
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Potential Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Price Comparison</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="price"
                      fill="#ffa726"
                      name="Price per Spot ($)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Parking Spots Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-4">
                  Parking Spots Details
                </h2>
                <Link to="/addspot">
                  <button className="btn btn-primary">Add Spot</button>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Spots
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {parkingSpots.map((spot) => (
                      <tr key={spot.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {spot.name}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {spot.location}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {spot.spots}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          Rs {spot.price}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">
                              {spot.phone_no}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div>
                            <button
                              className="btn btn-error"
                              onClick={() => {
                                setSelectedSpotId(spot.id);
                                document
                                  .getElementById("my_modal_2")
                                  .showModal();
                              }}
                            >
                              <FaTrash />
                            </button>

                            {/* Modal */}
                            <dialog id="my_modal_2" className="modal">
                              <div className="modal-box">
                                <h3 className="font-bold text-lg">
                                  Confirm Deletion
                                </h3>
                                <p className="py-4">
                                  Are you sure you want to delete this parking
                                  spot?
                                </p>
                                <div className="flex justify-end gap-4">
                                  <button
                                    onClick={() =>
                                      document
                                        .getElementById("my_modal_2")
                                        .close()
                                    }
                                    className="btn"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteParkingSpot(selectedSpotId)
                                    }
                                    className="btn btn-error"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </dialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
