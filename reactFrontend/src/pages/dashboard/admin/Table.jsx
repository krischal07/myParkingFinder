import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
const Table = ({ parkingSpots }) => {
  console.log("table plaves:", parkingSpots);
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Location</th>
            <th>Price</th>
            <th>Spots</th>
          </tr>
        </thead>
        {parkingSpots.map((spot, index) => {
          return (
            <tbody>
              <tr>
                <th>{index + 1}</th>
                <td>{spot.name}</td>
                <td>{spot.location}</td>
                <td>{spot.price}</td>
                <td>{spot.spots}</td>
                <td>
                  <button className="btn btn-primary mx-1">
                    <FaEdit />
                  </button>
                  <button className="btn btn-error">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

export default Table;
