import PhotosUploader from "../components/Places/PhotosUploader.jsx";
import Perks from "../components/Places/Perks.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../components/Account/AccountNav.jsx";
import { Navigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  // ✅ Fetch existing place if editing
  useEffect(() => {
    if (!id) return;
    axios.get(`/places/${id}`, { withCredentials: true }).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl font-semibold mt-6">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm mb-2">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  // ✅ Save or update place
  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      photos: addedPhotos, // ✅ Match backend field
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    try {
      if (id) {
        // ✅ Update existing place
        await axios.put(`/places/${id}`, placeData, { withCredentials: true });
      } else {
        // ✅ Create new place
        await axios.post("/places", placeData, { withCredentials: true });
      }
      setRedirect(true);
    } catch (e) {
      console.error("Save place error:", e.response?.data || e.message);
      alert("Failed to save. Please try again.");
    }
  }

  if (redirect) return <Navigate to={"/account/places"} />;

  return (
    <div className="px-4">
      <AccountNav />
      <form
        className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-6"
        onSubmit={savePlace}
      >
        {preInput("Title", "Short and catchy title for your place")}
        <Input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="My lovely apartment"
          required
        />

        {preInput("Address", "Address of this place")}
        <Input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="123 Main St, City"
          required
        />

        {preInput("Photos", "Add more photos for better visibility")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput("Description", "Describe your place in detail")}
        <Textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          placeholder="Describe your place..."
          required
        />

        {preInput("Perks", "Select all perks available at your place")}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-2">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput("Extra info", "House rules, additional info, etc")}
        <Textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
          placeholder="Any extra info..."
        />

        {preInput(
          "Check in & out times",
          "Set check in/out times and allow cleaning buffer"
        )}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mt-2">
          <div>
            <Label>Check in</Label>
            <Input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14"
              required
            />
          </div>
          <div>
            <Label>Check out</Label>
            <Input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="11"
              required
            />
          </div>
          <div>
            <Label>Max guests</Label>
            <Input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              min={1}
              required
            />
          </div>
          <div>
            <Label>Price per night</Label>
            <Input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              min={1}
              required
            />
          </div>
        </div>

        <Button className="w-full mt-6" type="submit">
          Save Place
        </Button>
      </form>
    </div>
  );
}
