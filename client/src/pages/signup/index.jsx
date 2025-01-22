import { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

const Signup = () => {
  const dispatch=useDispatch();
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const onFormSubmit = async (event) => {
    event.preventDefault();

    if (!user.firstname || !user.lastname || !user.email || !user.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      dispatch(showLoader());
      console.log("Sending user data:", user); // Debug
      const response = await signupUser(user);
      dispatch(hideLoader());
      console.log("API response:", response); // Debug
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error("Error in onFormSubmit:", error); // Log the error
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    }
  };

  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card_title">
          <h1>Create Account</h1>
        </div>
        <div className="form">
          <form onSubmit={onFormSubmit}>
            <div className="column">
              <input
                type="text"
                placeholder="First Name"
                value={user.firstname}
                onChange={(e) => setUser({ ...user, firstname: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={user.lastname}
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="card_terms">
          <span>
            Already have an account?
            <Link to="/login"> Login Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
