import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const resp = await axios.get(`/api/user/${listing.userRef}`);
        const data = await resp.data;
        console.log(data);
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedData();
  }, [listing.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            placeholder="Enter your message here..."
            onChange={onChange}
            className="w-full border p-3 rounded-lg"
            value={message}
            name="message"
            id="message"
            rows="2"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
