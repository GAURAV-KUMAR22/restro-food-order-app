import React, { useState } from "react";
import PrivateAxios from "../../Services/PrivateAxios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const NewPackage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    offerPrice: "",
    durationInDays: "",
    features: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...form.features];
    updatedFeatures[index] = value;
    setForm((prev) => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const addFeature = (e) => {
    e.preventDefault(); // Prevents submitting the form
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await PrivateAxios.post("/subscription/package", form);
      if (response.status === 201 || response.status === 200) {
        toast.success("Package successfully created");
        navigate("/superadmin/setting/packages");
      } else {
        toast.error("Failed to create package");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Package
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Price"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Offer Price
          </label>
          <input
            type="number"
            name="offerPrice"
            value={form.offerPrice}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Offer Price"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Duration (Days)
          </label>
          <input
            type="number"
            name="durationInDays"
            value={form.durationInDays}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Duration"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Features
          </label>
          {form.features.map((feature, index) => (
            <input
              key={index}
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder={`Feature ${index + 1}`}
            />
          ))}
          <button
            onClick={addFeature}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Add Feature
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700"
        >
          Submit Package
        </button>
      </form>
    </div>
  );
};
