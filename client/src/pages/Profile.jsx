import { FaTrash, FaEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// import child components
import DeleteListing from "./User-Listings/DeleteListing";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // handle file upload
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  // handle input fields change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await axios.post(
        `/api/user/update/${currentUser._id}`,
        formData
      );
      const data = response.data;
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success("User is updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("Failed to update user.");
    }
  };

  // Delete user Account
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    dispatch(deleteUserStart());

    try {
      const response = await axios.delete(
        `/api/user/delete/${currentUser._id}`
      );
      const data = response.data;

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      toast.success(data.message);
      setTimeout(() => {
        dispatch(deleteUserSuccess());
        navigate("/sign-up");
      }, 5000);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("Failed to delete user.");
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();

    dispatch(signOutUserStart());

    try {
      const res = await axios.get(`/api/auth/signout`);
      const data = res.data;

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        toast.error(data.message);
        return;
      }

      dispatch(signOutUserSuccess());
      toast.success("Signed out successfully!");
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      toast.error("Failed to sign out");
    }
  };

  // handle File selection
  const handleFileSelect = () => {
    fileRef.current.click();
  };

  // show listings
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await axios.get(`/api/user/listings/${currentUser._id}`);
      const data = res.data;

      if (data.success === false) {
        toast.error(data.message);
        setShowListingError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*"
        />
        <img
          className="self-center w-24 h-24 mt-2 object-cover rounded-full cursor-pointer"
          onClick={handleFileSelect}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          className="p-3 rounded-lg border"
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          name="username"
          onChange={handleInputChange}
        />
        <input
          className="p-3 rounded-lg border"
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          name="email"
          onChange={handleInputChange}
        />
        <input
          className="p-3 rounded-lg border"
          type="password"
          placeholder="password"
          name="password"
          onChange={handleInputChange}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase"
          type="submit"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="mt-5 flex justify-between">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <button
        onClick={handleShowListings}
        className="my-7 w-full text-green-700 uppercase"
        type="button"
      >
        Show Listings
      </button>
      {userListing && userListing.length > 0 && (
        <div className="flex flex-col gap-4 mb-10">
          <h1 className="text-center font-semibold text-2xl">Your Listings</h1>
          {userListing.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="h-20 w-28 rounded-lg object-cover"
                  />
                </Link>
                <Link to={`/listing/${listing._id}`}>
                  <h3 className="text-slate-700 font-semibold capitalize hover:underline">
                    {listing.name}
                  </h3>
                </Link>
              </div>

              <div className="flex gap-4 items-center">
                <DeleteListing
                  userListing={userListing}
                  setUserListing={setUserListing}
                  listingId={listing._id}
                />
                <Link to={`/update-listing/${listing._id}`}>
                  <button type="button" className="text-green-700">
                    <FaEdit />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
