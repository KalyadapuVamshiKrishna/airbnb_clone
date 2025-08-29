import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "./models/Place.js";
import User from "./models/User.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const samplePhotos = [
  "https://images.unsplash.com/photo-1615873968403-89e068629265?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661778773089-8718bcedb39e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9tZSUyMGludGVyaW9yfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1676823553207-758c7a66e9bb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlJTIwYnVpbGR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvdXNlfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2luZ3xlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661963657305-f52dcaeef418?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9kZXJuJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2V8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8fDA%3D",
  "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg",
];

const perksOptions = [
  "WiFi",
  "Free Parking",
  "Pool",
  "Air Conditioning",
  "Kitchen",
  "Pet Friendly",
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    // Get any user to assign as owner
    const user = await User.findOne();
    if (!user) {
      console.log("No user found. Please create a user first.");
      return;
    }

    // Clear old places
    await Place.deleteMany();

    const places = [
      {
        owner: user._id,
        title: "Luxury Beach House",
        address: "Miami Beach, Florida",
        photos: samplePhotos.slice(0, 3),
        description: "Beautiful beachfront property with modern amenities.",
        perks: ["WiFi", "Pool", "Air Conditioning"],
        extraInfo: "Perfect for families and friends.",
        checkIn: 14,
        checkOut: 11,
        maxGuests: 6,
        price: 300,
      },
      {
        owner: user._id,
        title: "Cozy Mountain Cabin",
        address: "Aspen, Colorado",
        photos: samplePhotos.slice(3, 6),
        description: "Rustic cabin with breathtaking mountain views.",
        perks: ["Free Parking", "Kitchen", "Pet Friendly"],
        extraInfo: "Ideal for a winter getaway.",
        checkIn: 15,
        checkOut: 10,
        maxGuests: 4,
        price: 180,
      },
      {
        owner: user._id,
        title: "Modern City Apartment",
        address: "Manhattan, New York",
        photos: samplePhotos.slice(6, 9),
        description: "Stylish apartment in the heart of the city.",
        perks: ["WiFi", "Air Conditioning", "Kitchen"],
        extraInfo: "Close to all major attractions.",
        checkIn: 13,
        checkOut: 12,
        maxGuests: 2,
        price: 220,
      },
      {
        owner: user._id,
        title: "Lakefront Villa",
        address: "Lake Tahoe, California",
        photos: samplePhotos.slice(0, 3),
        description: "Spacious villa with a private lake view.",
        perks: ["WiFi", "Free Parking", "Kitchen"],
        extraInfo: "Enjoy fishing and boating.",
        checkIn: 14,
        checkOut: 11,
        maxGuests: 8,
        price: 400,
      },
      {
        owner: user._id,
        title: "Desert Retreat",
        address: "Phoenix, Arizona",
        photos: samplePhotos.slice(3, 6),
        description: "Sunny retreat in the heart of the desert.",
        perks: ["Pool", "Air Conditioning", "WiFi"],
        extraInfo: "Perfect for relaxation.",
        checkIn: 15,
        checkOut: 11,
        maxGuests: 5,
        price: 150,
      },
       {
    owner: "64f5a9f1e1b1b2a9c8f1a9d2",
    title: "Rustic Beach Hut",
    address: "Goa, India",
    photos: [
      "https://plus.unsplash.com/premium_photo-1661766077694-6e3750b0fb97?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvbWUlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D"
    ],
    description: "Stay in a serene beach hut just 200m from the sea, ideal for a peaceful getaway.",
    perks: ["WiFi", "Free Parking", "Breakfast"],
    extraInfo: "Pet friendly, no loud music after 10 PM.",
    checkIn: 12,
    checkOut: 11,
    maxGuests: 4,
    price: 3000
  },
  {
    owner: "64f5a9f1e1b1b2a9c8f1a9d2",
    title: "Luxury Penthouse Suite",
    address: "Bandra, Mumbai",
    photos: [
      "https://plus.unsplash.com/premium_photo-1661766077694-6e3750b0fb97?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvbWUlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D"
    ],
    description: "An ultra-modern penthouse with skyline views, private jacuzzi, and home theater.",
    perks: ["WiFi", "Private Pool", "Air Conditioning"],
    extraInfo: "Smoking allowed only on balcony.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 6,
    price: 15000
  },
  {
    owner: "64f5a9f1e1b1b2a9c8f1a9d2",
    title: "Cozy Mountain Chalet",
    address: "Manali, Himachal Pradesh",
    photos: [
      "https://plus.unsplash.com/premium_photo-1661766077694-6e3750b0fb97?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvbWUlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D"
    ],
    description: "Perfect for a winter holiday. Wooden interiors, fireplace, and snow view.",
    perks: ["Heating", "WiFi", "Kitchen"],
    extraInfo: "Snow chains recommended for cars during winter.",
    checkIn: 13,
    checkOut: 11,
    maxGuests: 8,
    price: 8000
  },
  {
    owner: "64f5a9f1e1b1b2a9c8f1a9d2",
    title: "Urban Loft Apartment",
    address: "Bangalore, Karnataka",
    photos: [
      "https://plus.unsplash.com/premium_photo-1661766077694-6e3750b0fb97?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvbWUlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D"
    ],
    description: "A stylish loft in the city center with open plan design and high-speed internet.",
    perks: ["WiFi", "Elevator", "Work Desk"],
    extraInfo: "Ideal for digital nomads.",
    checkIn: 15,
    checkOut: 11,
    maxGuests: 2,
    price: 5000
  },
  {
    owner: "64f5a9f1e1b1b2a9c8f1a9d2",
    title: "Traditional Kerala Houseboat",
    address: "Alleppey, Kerala",
    photos: [
      "https://plus.unsplash.com/premium_photo-1661766077694-6e3750b0fb97?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvbWUlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D"
    ],
    description: "Cruise the backwaters of Kerala in a luxurious houseboat with authentic meals.",
    perks: ["Meals Included", "Air Conditioning", "WiFi"],
    extraInfo: "Boat check-in starts at 12 PM sharp.",
    checkIn: 12,
    checkOut: 10,
    maxGuests: 5,
    price: 10000
  }
    ];

    await Place.insertMany(places);
    console.log("✅ Places seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
