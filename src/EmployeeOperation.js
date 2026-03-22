import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";

function EmployeeOperation() {
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      const userRole =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      setRole(userRole);

      fetch("https://localhost:7233/api/Token/employees", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          console.log("Status:", res.status);
          if (!res.ok) throw new Error("API Error");
          return res.json();
        })
        .then((data) => {
          console.log("Employees:", data);
          setEmployees(data);
        })
        .catch((err) => console.error("Fetch error:", err));

    } catch (err) {
      console.error("Token error:", err);
    }

  }, [token]);

  // ✅ ONLY ONE DELETE FUNCTION (INSIDE COMPONENT)
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7233/api/Token/deleteemployee/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Deleted successfully");

      // update UI
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));

    } catch (err) {
      console.error(err);
      alert("Error deleting employee");
    }
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <h2 className="title">Employee List</h2>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Role</th>
            <th>Username</th>
            <th>Manager</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.role}</td>
                <td>{emp.employeeUserName}</td>
                <td>{emp.managerName}</td>

                <td>
                  {role === "Manager" && (
                    <button onClick={() => handleDelete(emp.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeOperation;