import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router-dom";

function Networking() {
  const axiosPublic = useAxiosPublic();

  const {
    isLoading,
    isError,
    data: products = [],
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data;
    },
  });

  // Filter states
  const [filters, setFilters] = useState({
    processor: "",
    ram: "",
    ssd: "",
  });

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 500000,
  });

  // Extract processor, RAM, SSD info from key_features array
  const extractSpecs = (keyFeatures) => {
    let processor = "";
    let ram = "";
    let ssd = "";

    keyFeatures.forEach((feature) => {
      const lower = feature.toLowerCase();

      if (lower.includes("processor")) {
        // Extract after "Processor: "
        processor = feature.replace(/processor:\s*/i, "").trim();
        // Optionally trim to main name like "Ryzen 7"
        if (processor.toLowerCase().includes("ryzen")) {
          const match = processor.match(/ryzen \d+/i);
          if (match) processor = match[0];
        } else if (processor.toLowerCase().includes("core i")) {
          const match = processor.match(/core i\d+/i);
          if (match) processor = match[0];
        } else if (processor.toLowerCase().includes("snapdragon")) {
          const match = processor.match(/snapdragon \w+ ?\w*/i);
          if (match) processor = match[0];
        }
      }

      if (lower.includes("ram")) {
        // RAM usually like "RAM: 16GB DDR5 6400MHz; Storage: 1TB SSD"
        // Split by semicolon or comma
        const parts = feature.split(/[;,]/);
        parts.forEach((part) => {
          if (part.toLowerCase().includes("ram")) {
            const ramMatch = part.match(/\d+GB/i);
            if (ramMatch) ram = ramMatch[0];
          }
          if (
            part.toLowerCase().includes("storage") ||
            part.toLowerCase().includes("ssd")
          ) {
            const ssdMatch = part.match(/\d+TB|\d+GB/i);
            if (ssdMatch) ssd = ssdMatch[0];
          }
        });
      }

      // In case Storage/SSD info is in a separate string and ssd not found yet
      if ((lower.includes("storage") || lower.includes("ssd")) && !ssd) {
        const ssdMatch = feature.match(/\d+TB|\d+GB/i);
        if (ssdMatch) ssd = ssdMatch[0];
      }
    });

    return { processor, ram, ssd };
  };

  // Filter only laptops
  const LaptopData = products.filter((product) => product.category === "Networking");

  // Handle checkbox filter change
  const handleChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? "" : value,
    }));
  };

  // Handle price inputs
  const handlePriceChange = (e, type) => {
    const value = Number(e.target.value);
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Filtered laptops according to filters
  const filteredData = LaptopData.filter((pc) => {
    const priceNumber = Number(pc.price.toString().replace(/,/g, ""));

    const { processor, ram, ssd } = extractSpecs(pc.key_features || []);

    return (
      (!filters.processor || processor.toLowerCase().includes(filters.processor.toLowerCase())) &&
      (!filters.ram || ram === filters.ram) &&
      (!filters.ssd || ssd === filters.ssd) &&
      priceNumber >= priceRange.min &&
      priceNumber <= priceRange.max
    );
  });

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-blue-500">Loading products...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">Error loading products.</p>
    );
  }

  return (
    <div className="mt-28 min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center"> Networking Catalog</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="space-y-6 bg-white p-4 rounded shadow-md">
          {/* Price Range */}
          <div>
            <h4 className="font-bold mb-2">Price Range (৳)</h4>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceChange(e, "min")}
                className="w-full border px-2 py-1 rounded"
                min={0}
              />
              <span>to</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(e, "max")}
                className="w-full border px-2 py-1 rounded"
                min={0}
              />
            </div>
          </div>

          {/* Processor */}
          <div>
            <h4 className="font-bold mb-2">Processor</h4>
            {["Ryzen 5", "Ryzen 7", "Core i3", "Snapdragon X Plus"].map((item) => (
              <div key={item}>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.processor === item}
                    onChange={() => handleChange("processor", item)}
                  />
                  <span className="ml-2">{item}</span>
                </label>
              </div>
            ))}
          </div>

          {/* RAM */}
          <div>
            <h4 className="font-bold mb-2">RAM</h4>
            {["8GB", "16GB"].map((item) => (
              <div key={item}>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.ram === item}
                    onChange={() => handleChange("ram", item)}
                  />
                  <span className="ml-2">{item}</span>
                </label>
              </div>
            ))}
          </div>

          {/* SSD */}
          <div>
            <h4 className="font-bold mb-2">SSD</h4>
            {["256GB", "512GB", "1TB"].map((item) => (
              <div key={item}>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.ssd === item}
                    onChange={() => handleChange("ssd", item)}
                  />
                  <span className="ml-2">{item}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="md:col-span-3">
          {filteredData.length === 0 ? (
            <p className="text-center text-red-500 font-semibold">
              No Laptops found with selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredData.map((pc) => {
                const { processor, ram, ssd } = extractSpecs(pc.key_features || []);
                return (
                  <Link to={`/product/${pc._id}`}
                    key={pc._id}
                    className="border rounded-lg p-4 shadow-md bg-white"
                  >
                    <img
                      src={pc.image || "https://via.placeholder.com/150"}
                      alt={pc.title}
                      className="w-full h-40 object-cover rounded"
                    />
                    <h2 className="font-semibold mt-2">{pc.title}</h2>
                    <p className="text-sm text-gray-600">
                      Processor: {processor || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      RAM: {ram || "N/A"} | SSD: {ssd || "N/A"}
                    </p>
                    <p className="text-red-600 font-bold mt-2">
                      {Number(pc.price).toLocaleString()} ৳
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Networking;
