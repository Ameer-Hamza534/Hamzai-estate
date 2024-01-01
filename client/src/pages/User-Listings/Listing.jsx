import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import "../../index.css";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBath,
  FaBed,
  FaChair,
  FaParking,
} from "react-icons/fa";
import Contact from "../../components/Contact";

const Listing = () => {
  const params = useParams();
  SwiperCore.use(Navigation);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    setLoading(true);
    const fetchedData = async () => {
      try {
        const resp = await axios.get(`/api/listing/get/${params.listingId}`);
        const data = await resp.data;
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data.data);
        setError(false);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchedData();
  }, [params.listingId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main>
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10">
            <div
              className="border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer tooltip"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={copyToClipboard}
            >
              <FaShare className="text-slate-500" />
              {showTooltip && (
                <span className="tooltiptext">
                  {copied ? "Link copied!" : "Copy link"}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="text-slate-600 font-semibold flex items-center gap-2 mt-6">
              <FaMapMarkerAlt className="text-green-700" /> {listing.address}
            </p>
            <div className="flex gap-4 mb-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="text-black font-semibold">Description - </span>
              {listing.description}
            </p>
            <ul className="flex flex-wrap gap-4 sm:gap-6 text-green-900 font-semibold text-sm">
              <li className="flex gap-1 items-center whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex gap-1 items-center whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex gap-1 items-center whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex gap-1 items-center whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                type="button"
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white font-medium p-3 rounded-lg capitalize hover:opacity-95"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
