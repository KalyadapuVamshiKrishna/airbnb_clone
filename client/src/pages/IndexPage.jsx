import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/places")
      .then((response) => setPlaces(Array.isArray(response.data) ? response.data : []))
      .catch((err) => {
        console.error("Failed to fetch places:", err);
        setPlaces([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="col-span-full text-center text-gray-500 py-10">
        Loading places...
      </div>
    );
  }

  if (!places.length) {
    return (
      <div className="col-span-full text-center text-gray-500 py-10">
        No places found.
      </div>
    );
  }

  return (
    <div className="mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.map((place) => (
        <Link key={place._id} to={`/place/${place._id}`} className="group">
          <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            {place.photos?.[0] && (
              <div className="relative w-full h-60">
                <Image
                  className="rounded-t-2xl object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  src={place.photos[0]}
                  alt={place.title || "Place"}
                />
              </div>
            )}
            <CardContent className="p-4">
              <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold">{place.address || "Unknown address"}</CardTitle>
                <CardDescription className="text-sm text-gray-500">{place.title || "Unknown title"}</CardDescription>
              </CardHeader>
              <div className="mt-2 text-gray-900 font-semibold">
                ${place.price ?? "N/A"} <span className="text-gray-500 font-normal">per night</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
