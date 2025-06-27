import React, { useState } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const NewPackage = () => {
  const Navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    offerPrice: "",
    durationInDays: "",
    features: [""], // 👈 features is an array now
  });

  // Handle title and price change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle dynamic features input change
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...form.features];
    updatedFeatures[index] = value;
    setForm((prev) => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  // Add new empty feature input
  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await PrivateAxios.post("/subscription/package", form);
    // if (!response.status(201)) {
    //   throw toast.error("response failed");
    // }
    toast.success("/Package successfully created");
    Navigate("/superadmin/setting/package");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full bg-gray-200 flex flex-col justify-center items-center sm:mx-auto shadow-2xl"
      >
        <div className="w-full flex flex-col p-4">
          <label htmlFor="title" className="text-xl font-medium my-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 bg-white"
            placeholder="Enter Title"
          />

          <label htmlFor="price" className="text-xl font-medium my-2">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 bg-white"
            placeholder="Enter Price"
          />

          <label htmlFor="price" className="text-xl font-medium my-2">
            Offer Price
          </label>
          <input
            type="number"
            name="offerPrice"
            value={form.offerPrice}
            onChange={handleChange}
            className="w-full p-2 bg-white"
            placeholder="Enter offer Price"
          />
          <label htmlFor="price" className="text-xl font-medium my-2">
            Duration In Days
          </label>
          <input
            type="number"
            name="durationInDays"
            value={form.durationInDays}
            onChange={handleChange}
            className="w-full p-2 bg-white"
            placeholder="Enter duration"
          />

          <label className="text-xl font-medium my-2">Features</label>
          {form.features.map((feature, index) => (
            <input
              key={index}
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="w-full p-2 bg-white mb-2"
              placeholder={`Feature ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Add Feature
          </button>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white text-xl"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
