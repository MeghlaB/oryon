import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

function Component() {
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

     
      if ((lower.includes("storage") || lower.includes("ssd")) && !ssd) {
        const ssdMatch = feature.match(/\d+TB|\d+GB/i);
        if (ssdMatch) ssd = ssdMatch[0];
      }
    });

    return { processor, ram, ssd };
  };

  // Filter only laptops
  const desktopPCs = products.filter((product) => product.category === "Component");

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
  const filteredData = desktopPCs.filter((pc) => {
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
      <p className="mt-10 text-center text-blue-500">Loading products...</p>
    );
  }

  if (isError) {
    return (
      <p className="mt-10 text-center text-red-500">Error loading products.</p>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100 mt-28">
      <h1 className="mb-6 text-2xl font-bold text-center">Component Catalog</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Filter Sidebar */}
        <div className="p-4 space-y-6 bg-white rounded shadow-md">
          {/* Price Range */}
          <div>
            <h4 className="mb-2 font-bold">Price Range (৳)</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceChange(e, "min")}
                className="w-full px-2 py-1 border rounded"
                min={0}
              />
              <span>to</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(e, "max")}
                className="w-full px-2 py-1 border rounded"
                min={0}
              />
            </div>
          </div>

          {/* Processor */}
          <div>
            <h4 className="mb-2 font-bold">Processor</h4>
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
            <h4 className="mb-2 font-bold">RAM</h4>
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
            <h4 className="mb-2 font-bold">SSD</h4>
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
            <p className="font-semibold text-center text-red-500">
              No Laptops found with selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredData.map((pc) => {
                const { processor, ram, ssd } = extractSpecs(pc.key_features || []);
                return (
                  <div
                    key={pc._id}
                    className="p-4 bg-white border rounded-lg shadow-md"
                  >
                    <img
                      src={pc.image || "https://via.placeholder.com/150"}
                      alt={pc.title}
                      className="object-cover w-full h-40 rounded"
                    />
                    <h2 className="mt-2 font-semibold">{pc.title}</h2>
                    <p className="text-sm text-gray-600">
                      Processor: {processor || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      RAM: {ram || "N/A"} | SSD: {ssd || "N/A"}
                    </p>
                    <p className="mt-2 font-bold text-red-600">
                      {Number(pc.price).toLocaleString()} ৳
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Component;
