import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const DeleteListing = ({ userListing, setUserListing, listingId }) => {
  const [listingDeleteError, setListingDeleteError] = useState(false);

  //   Handle deletion
  const handleDeleteListing = async () => {
    try {
      setListingDeleteError(false);
      const res = await axios.delete(`/api/listing/delete/${listingId}`);
      const data = await res.data;

      if (data.success === false) {
        setListingDeleteError(true);
        toast.error(data.message);
        return;
      }

      setUserListing(
        userListing.filter((listing) => listing._id !== listingId)
      );
      toast.success(data.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleDeleteListing}
      type="button"
      className="text-red-700"
    >
      <FaTrash />
    </button>
  );
};

export default DeleteListing;
