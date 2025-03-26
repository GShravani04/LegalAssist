import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sign = () => {
  const navigate = useNavigate(); // 🔹 Allows redirection after login/signup

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  // Handle input changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset errors before making a request

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", loginData);
      if (res.data.success) {
        sessionStorage.setItem("token", res.data.token); // ✅ Store JWT token properly
        navigate("/dashboard"); // ✅ Redirect user after login
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login Error:", err);
    }
  };

  // 🔹 Handle Signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Sending Data to Backend:", signupData);


    if (signupData.password !== signupData.repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", signupData);
      if (res.data.success) {
        sessionStorage.setItem("token", res.data.token); // ✅ Store JWT token properly
        navigate("/dashboard"); // ✅ Redirect user after signup
      } else {
        setError("Signup failed. Email may already be registered.");
      }
    } catch (err) {
      setError("Signup failed. Email may already be registered.");
      console.error("Signup Error:", err);
    }
  };

  return (
    <>
      <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
        <li className="nav-item" role="presentation">
          <a className="nav-link active" id="tab-login" data-mdb-toggle="pill" href="#pills-login" role="tab"
            aria-controls="pills-login" aria-selected="true">Login</a>
        </li>
        <li className="nav-item" role="presentation">
          <a className="nav-link" id="tab-register" data-mdb-toggle="pill" href="#pills-register" role="tab"
            aria-controls="pills-register" aria-selected="false">Register</a>
        </li>
      </ul>
      <div className="tab-content">
        <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
          <form onSubmit={handleLoginSubmit}>
            <div className="text-center mb-3">
              <p>Sign in with:</p>
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-google"></i>
              </button>
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-twitter"></i>
              </button>
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-github"></i>
              </button>
            </div>
            <p className="text-center">or:</p>
            <div className="form-outline mb-4">
              <input type="email" id="loginName" name="email" className="form-control" onChange={handleLoginChange} value={loginData.email} />
              <label className="form-label" htmlFor="loginName">Email or username</label>
            </div>
            <div className="form-outline mb-4">
              <input type="password" id="loginPassword" name="password" className="form-control" onChange={handleLoginChange} value={loginData.password} />
              <label className="form-label" htmlFor="loginPassword">Password</label>
            </div>
            <div className="row mb-4">
              <div className="col-md-6 d-flex justify-content-center">
                <div className="form-check mb-3 mb-md-0">
                  <input className="form-check-input" type="checkbox" value="" id="loginCheck" checked />
                  <label className="form-check-label" htmlFor="loginCheck"> Remember me </label>
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <a href="#!">Forgot password?</a>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>
            <div className="text-center">
              <p>Not a member? <a href="#!">Register</a></p>
            </div>
          </form>
        </div>
        <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
          <form onSubmit={handleSignupSubmit}>
            <div className="text-center mb-3">
              <p>Sign up with:</p>
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-google"></i>
              </button>
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-twitter"></i>
              </button>
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-github"></i>
              </button>
            </div>
            <p className="text-center">or:</p>
            <div className="form-outline mb-4">
              <input type="text" id="registerName" name="name" className="form-control" onChange={handleSignupChange} value={signupData.name} />
              <label className="form-label" htmlFor="registerName">Name</label>
            </div>
            <div className="form-outline mb-4">
              <input type="text" id="registerUsername" name="username" className="form-control" onChange={handleSignupChange} value={signupData.username} />
              <label className="form-label" htmlFor="registerUsername">Username</label>
            </div>
            <div className="form-outline mb-4">
              <input type="email" id="registerEmail" name="email" className="form-control" onChange={handleSignupChange} value={signupData.email} />
              <label className="form-label" htmlFor="registerEmail">Email</label>
            </div>
            <div className="form-outline mb-4">
              <input type="password" id="registerPassword" name="password" className="form-control" onChange={handleSignupChange} value={signupData.password} />
              <label className="form-label" htmlFor="registerPassword">Password</label>
            </div>
            <div className="form-outline mb-4">
              <input type="password" id="registerRepeatPassword" name="repeatPassword" className="form-control" onChange={handleSignupChange} value={signupData.repeatPassword} />
              <label className="form-label" htmlFor="registerRepeatPassword">Repeat password</label>
            </div>
            <div className="form-check d-flex justify-content-center mb-4">
              <input className="form-check-input me-2" type="checkbox" value="" id="registerCheck" checked
                aria-describedby="registerCheckHelpText" />
              <label className="form-check-label" htmlFor="registerCheck">
                I have read and agree to the terms
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-block mb-3">Sign up</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Sign;
