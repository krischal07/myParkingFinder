import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  console.log(users);
  return (
    <div>
      <h1 className="bg-red-500">Users</h1>
      <ul>
        {users.map((user) => (
          <div>
            <li key={user.id}>{user.name}</li>
            {/* <li key={user.id}>{user.email}</li> */}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Users;
