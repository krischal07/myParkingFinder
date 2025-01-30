import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
const Table = ({ places }) => {
  console.log("table plaves:", places);
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Date</th>
            <th>email</th>
            <th>Action</th>
          </tr>
        </thead>
        {places.map((place, index) => {
          return (
            <tbody>
              {/* row 1 */}
              <tr>
                <th>{index + 1}</th>
                <td>{place.name}</td>
                <td>{place.email_verified_at}</td>
                <td>{place.email}</td>
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
