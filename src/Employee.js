import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import "./App.css";

export class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      redirect: false
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7233/api/Token/GetToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          UserName: this.state.userName,
          Password: this.state.password
        })
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // ✅ store token
      localStorage.setItem("token", data.token);

      // ✅ redirect
      this.setState({ redirect: true });

    } catch (err) {
      alert("Login failed");
    }
  };

  // ✅ logout (optional but useful)
  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({ redirect: false });
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/employees" />;
    }

    return (
      <div className="login-container">
        <div className="login-box">

          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                id="userName"
                className="input-field"
                onChange={this.handleChange}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                id="password"
                className="input-field"
                onChange={this.handleChange}
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

        </div>
      </div>
    );
  }
}

export default Employee;