import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Signup = () => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axios.post('http://localhost:5000/api/auth/signup', data);

  //     if (res.data.success) {
  //       sessionStorage.setItem("userId", res.data.userId);
  //       setIsError(false);
  //       navigate('/'); 
  //     } else {
  //       setIsError(true);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("🔹 Form Data Before Sending:", data); // ✅ Log the form data

//     try {
//         const res = await axios.post(
//             "http://localhost:5000/api/auth/signup",
//             data,
//             {
//                 headers: {
//                     "Content-Type": "application/json" // ✅ Ensure JSON format
//                 }
//             }
//         );

//         console.log("✅ Response from Backend:", res.data); // ✅ Log response

//         if (res.data.success) {
//             sessionStorage.setItem("userId", res.data.userId);
//             setIsError(false);
//             navigate('/'); 
//         } else {
//             console.error("⚠️ Signup Failed - Backend Response:", res.data);
//             setIsError(true);
//         }
//     } catch (err) {
//         console.error("❌ Signup Request Failed:", err.response?.data || err.message); // ✅ Log detailed error
//         setIsError(true);
//     }
// };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", data);

      if (res.data.success) {
          sessionStorage.setItem("userId", res.data.userId);
          navigate('/login');  // ✅ Redirect to Home after signup
      } else {
          setIsError(true);
      }
  } catch (err) {
      console.log(err);
  }
};



  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Already Have An Account?</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sign in
            </button>
          </Link>
        </div>

        <div className={styles.right}>
          {isError ? <p>Invalid input</p> : null}
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Sign Up for an Account</h1>
            <input
              type="text" 
              placeholder="Enter your Name"
              name="name"
              onChange={handleChange}
              value={data.name}
              required
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.green_btn}><Link to="/login">  </Link>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;