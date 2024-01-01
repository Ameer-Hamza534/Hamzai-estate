import { Link } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ListingItem = ({ listing }) => {
  return (
    <div className="sm:w-[330px] bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale: duration-300"
        />
        <div className="p-4 gap-2 w-full flex flex-col">
          <p className="font-semibold text-lg text-slate-700 capitalize truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 w-full">{listing.address}</p>
          </div>
          <p className="truncate text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && "/ month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs flex gap-1 items-center whitespace-nowrap">
              <FaBed className="text-lg" />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs flex gap-1 items-center whitespace-nowrap">
              <FaBath className="text-lg" />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
