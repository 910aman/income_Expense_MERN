import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/RegisterPage.css";
// import image from "./rupees.jpeg";
import image from "./money.png";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Custom validation function for email (checks for common typos)
  const validateEmail = (_, value) => {
    // Regular expression to match common email domains
    const domainPattern = /@(gmail|yahoo|outlook|hotmail)\.com$/i;

    if (!value.match(domainPattern)) {
      return Promise.reject("Invalid email format or common typos");
    }
    return Promise.resolve();
  };

  // Custom validation function for name (no numbers allowed)
  const validateName = (_, value) => {
    if (/\d/.test(value)) {
      return Promise.reject("Numbers are not allowed in the name");
    }
    return Promise.resolve();
  };

  // Custom validation function for password (min 8 characters, one uppercase, one special character)
  const validatePassword = (_, value) => {
    if (value.length < 8) {
      return Promise.reject("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(
        "Password must contain at least one uppercase letter"
      );
    }
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value)) {
      return Promise.reject(
        "Password must contain at least one special character"
      );
    }
    return Promise.resolve();
  };

  // Form submit handler
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post("/users/register", values);
      message.success("Registration Successful");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  // Prevent login users from accessing the registration page
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

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
            <h1>Please Register!!</h1>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your name" },
                { validator: validateName },
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
                { validator: validateEmail }, // Add email validation
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
              <Link to="/login">Already Registered? Login here!</Link>
              <button className="btn ">Register</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
