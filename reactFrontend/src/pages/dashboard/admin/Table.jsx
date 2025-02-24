import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Table = ({ parkingSpots, setParkingSpots }) => {
  console.log("table plaves:", parkingSpots);
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
                  <div>
                    <button
                      className="btn btn-error"
                      onClick={() => {
                        setSelectedSpotId(spot.id);
                        document.getElementById("my_modal_2").showModal();
                      }}
                    >
                      <FaTrash />
                    </button>

                    {/* Modal */}
                    <dialog id="my_modal_2" className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        <p className="py-4">
                          Are you sure you want to delete this parking spot?
                        </p>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() =>
                              document.getElementById("my_modal_2").close()
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

                  {/* <button
                    onClick={() => handleDeleteParkingSpot(spot.id)}
                    className="btn btn-error"
                  >
                    <FaTrash />
                  </button> */}
                  {/* Modal  */}
                  {/* <button
                    className="btn btn-error"
                    onClick={() =>
                      document.getElementById("my_modal_2").showModal()
                    }
                  >
                    <FaTrash />
                  </button>
                  <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Hello!</h3>
                      <p className="py-4">
                        Do you want to delete the parking spot?
                      </p>
                      <button
                        onClick={() => handleDeleteParkingSpot(spot.id)}
                        className="btn btn-error"
                      >
                        Delete
                      </button>
                    </div>
                    <form method="dialog">
                      <button className="btn">close</button>
                    </form>
                  </dialog> */}
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
