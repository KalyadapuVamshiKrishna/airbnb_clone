import mongoose from "mongoose";
import dotenv from "dotenv";
import Experience from "./models/Experience.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const mockExperiences = [
  {
    title: "Hot Air Balloon Ride",
    description: "Soar above the beautiful landscapes at sunrise.",
    location: "Jaipur, India",
    price: 2500,
    duration: "2 hours",
    rating: 4.9,
    reviewsCount: 320,
    category: "Adventure",
    images: [
      "https://res.cloudinary.com/demo/image/upload/balloon-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/balloon-2.jpg",
      "https://res.cloudinary.com/demo/image/upload/balloon-3.jpg"
    ],
  },
  {
    title: "Cooking Class with Local Chef",
    description: "Learn to cook authentic Indian dishes with a pro.",
    location: "Hyderabad, India",
    price: 1200,
    duration: "3 hours",
    rating: 4.8,
    reviewsCount: 210,
    category: "Food & Drinks",
    images: [
      "https://res.cloudinary.com/demo/image/upload/cooking-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/cooking-2.jpg",
      "https://res.cloudinary.com/demo/image/upload/cooking-3.jpg"
    ],
  },
  {
    title: "Trekking in the Himalayas",
    description: "Explore the breathtaking Himalayan trails.",
    location: "Manali, India",
    price: 4500,
    duration: "8 hours",
    rating: 4.7,
    reviewsCount: 510,
    category: "Nature",
    images: [
      "https://res.cloudinary.com/demo/image/upload/trek-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/trek-2.jpg",
      "https://res.cloudinary.com/demo/image/upload/trek-3.jpg"
    ],
  },
  {
    title: "Scuba Diving Adventure",
    description: "Dive into the Arabian Sea with certified instructors.",
    location: "Goa, India",
    price: 3000,
    duration: "4 hours",
    rating: 4.9,
    reviewsCount: 620,
    category: "Water Sports",
    images: [
      "https://res.cloudinary.com/demo/image/upload/scuba-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/scuba-2.jpg",
      "https://res.cloudinary.com/demo/image/upload/scuba-3.jpg"
    ],
  },
  {
    title: "Desert Safari",
    description: "Ride through sand dunes in an adventurous jeep safari.",
    location: "Jaisalmer, India",
    price: 2000,
    duration: "5 hours",
    rating: 4.6,
    reviewsCount: 450,
    category: "Adventure",
    images: [
      "https://res.cloudinary.com/demo/image/upload/desert-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/desert-2.jpg",
      "https://res.cloudinary.com/demo/image/upload/desert-3.jpg"
    ],
  },
];

async function seedExperiences() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await Experience.deleteMany();
    console.log("Old experiences removed");

    await Experience.insertMany(mockExperiences);
    console.log("Mock experiences inserted");

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding experiences:", error);
    mongoose.connection.close();
  }
}

seedExperiences();
