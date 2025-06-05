import React, { useState } from "react";

export const SalesFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    category: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onFilter(filters);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="TypeCategory"
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="border rounded"
        />

        <select
          name="paymentMethod"
          value={filters.paymentMethod}
          onChange={handleChange}
        >
          <option value="">All Payment Methods</option>
          <option value="cash">Cash</option>
          <option value="online">Online</option>
        </select>
      </div>
      <div className=" flex mt-5">
        <button
          className="bg-blue-600 w-full text-white p-2 rounded"
          onClick={handleApply}
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};
