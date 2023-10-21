import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/LoginPage.css"; // Assuming LoginPage.css contains your custom styles
// import image from "./rupees.jpeg";
import image from "./money.png";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form submit handler
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/users/login", values);
      setLoading(false);
      message.success("Login success");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  // Prevent logged-in users from accessing the login page
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  // Validation function for email
  const validateEmail = (rule, value, callback) => {
    // Regular expression to check if the email is in the correct format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (value && !emailPattern.test(value)) {
      callback("Invalid email format");
    } else {
      // Check for common typos in the domain part of the email
      const typoDomains = [
        "gamil.com",
        "gmali.com",
        "gimli.com",
        "gaamil.com",
        "yahooo.com",
        "hotmaail.com",
      ]; // Add more typo domains if needed

      const emailParts = value.split("@");
      if (emailParts.length === 2) {
        const domain = emailParts[1].toLowerCase();
        if (typoDomains.includes(domain)) {
          callback("typo mistake email domain");
        } else {
          callback();
        }
      } else {
        callback("Invalid email format");
      }
    }
  };

  // Validation function for password
  const validatePassword = (rule, value, callback) => {
    // Check if the password is at least 8 characters long and contains at least one uppercase letter and one special character
    if (
      value &&
      (value.length < 8 ||
        !/[A-Z]/.test(value) ||
        !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value))
    ) {
      callback(
        "Password must be at least 8 characters long and contain one uppercase letter and one special character"
      );
    } else {
      callback();
    }
  };

  return (
    <div className="login-page" style={{ background: "#f0f0f0" }}>
      {loading && <Spinner />}
      <div className="row container">
        <div style={{ textAlign: "center" }}>
          <h1 className="mainheader"> Income-Expense Tracker </h1>
          <h5 className="fontstyle">
            Track all your income and expenses in one place
          </h5>
        </div>
        <div className="col-md-6">
          <img
            // className="register-img"
            src={image}
            alt="login-img"
            width={"100%"}
            height="100%"
          />
        </div>
        <div className="col-md-4 login-form">
          <Form layout="vertical" onFinish={submitHandler}>
            <h1>Please Login!!</h1>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { validator: validateEmail },
              ]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { validator: validatePassword },
              ]}
            >
              <Input type="password" />
            </Form.Item>
            <div className="d-flex justify-content-between">
              <Link to="/register">Not a user? Click Here to register!</Link>
              <button className="btn">Login</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
