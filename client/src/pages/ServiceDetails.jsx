"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import BookingWidget from "../components/Booking/BookingWidget";



export default function ServicePage() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`/services/${id}`).then((response) => setService(response.data));
  }, [id]);

  if (!service)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading service details...
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-18">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{service.title}</h1>
        </div>

        {/* Image */}
        <div className="rounded-3xl overflow-hidden shadow-md mb-6">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Info & Payment */}
        <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr]">
          {/* Description */}
          <div className="flex flex-col gap-6">
            <Card className="shadow-lg rounded-3xl">
              <CardContent>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                <div className="mt-4 text-gray-600 space-y-2">
                  <div>
                    <span className="font-semibold">Price:</span> ₹{service.price}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Widget */}
          <div className="lg:w-[380px] flex-shrink-0">
            <Card className="sticky top-24 shadow-lg rounded-3xl">
              <CardContent>
                <BookingWidget item={service} type="service" />


              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
