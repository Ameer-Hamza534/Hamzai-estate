import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import OAth from "../components/OAth";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  let [loading, setLoading] = useState(false);

  const { username, email, password } = formData;
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      axios
        .post("/api/auth/signup", {
          username,
          email,
          password,
        })
        .then((res) => {
          setTimeout(() => setLoading(false), 5000);

          console.log("Data", res.data);
          localStorage.setItem("userData", JSON.stringify(res.data));
          // console.log(localStorage.getItem("userData"))

          if (res.data.success === false) {
            toast.error(res.data.message);
          } else if (res.data.success === true) {
            toast.success(res.data.message);
            setTimeout(() => {
              navigate("/sign-in");
            }, 5000);
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(function (error) {
          setTimeout(() => setLoading(false), 5000);

          toast.error(`🦄` + error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          name="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          name="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="rounded-lg bg-slate-700 text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
