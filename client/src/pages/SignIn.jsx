import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAth from "../components/OAth";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      axios
        .post("/api/auth/signin", { email, password })
        .then((res) => {
          localStorage.setItem("userData", JSON.stringify(res.data));
          Cookies.set("buyerToken", res.data.access_token, { expires: 7 });

          setTimeout(() => setLoading(false), 5000);
          console.log("data", res.data);

          if (res.data.success === false) {
            dispatch(signInFailure(res.data.message));
            toast.error(res.data.message);
            navigate("/sign-in");
          } else if (res.data.success === true) {
            dispatch(signInSuccess(res.data));
            toast.success(res.data.message);
            setTimeout(() => {
              navigate("/");
            }, 5000);
          } else {
            toast(res.data.message);
          }
        })
        .catch(function (error) {
          dispatch(signInFailure(error.response.data.message));
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
          console.log(error.response.data.message);
        });
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <button className="rounded-lg bg-slate-700 text-white p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <OAth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don&#39;t have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
