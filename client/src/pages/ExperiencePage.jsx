import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    axios.get("/experiences").then(response => {
      setExperiences(response.data);
    });
  }, []);

  return (
    <div className="mt-26 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {experiences.length > 0 &&
        experiences.map(exp => (
          <Link to={`/experiences/${exp._id}`} key={exp._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {exp.photos?.[0] && (
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={exp.photos[0]}
                  alt={exp.title}
                />
              )}
            </div>
            <h2 className="font-bold">{exp.title}</h2>
            <h3 className="text-sm text-gray-500">{exp.location}</h3>
            <div className="mt-1">
              <span className="font-bold">₹{exp.price}</span> / person
            </div>
          </Link>
        ))}
    </div>
  );
}
