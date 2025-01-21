import React, { useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // Import trash icon

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Reset states when a new upload is initiated
  const resetStates = () => {
    setMatches([]);
    setFilteredMatches([]);
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPreview(null);
    setShowFilters(false);
  };

  // Handle file input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    resetStates(); // Reset states for a new upload
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // Preview for uploaded file
    setImageUrl(""); // Clear image URL to avoid conflict
  };

  // Handle URL input
  const handleUrlChange = (e) => {
    const enteredUrl = e.target.value.trim();
    resetStates(); // Reset states for a new upload
    setImageUrl(enteredUrl);
    if (enteredUrl) {
      setPreview(enteredUrl); // Directly use the URL for preview
    }
    setFile(null); // Clear file to avoid conflict
  };
  

  // Delete file or URL
  const deleteFile = () => {
    setFile(null);
    setPreview(null);
  };

  const deleteUrl = () => {
    setImageUrl("");
    setPreview(null);
  };

  const deletePreview = () => {
    setFile(null);
    setImageUrl("");
    setPreview(null);
  };

  // Handle upload and process file
  const handleUpload = async () => {
    const formData = new FormData();
  
    if (file) {
      formData.append("image", file); // Add file to FormData
    } else if (imageUrl) {
      try {
        const urlResponse = await axios.get(imageUrl, { responseType: "blob" });
        const blob = new Blob([urlResponse.data], { type: "image/jpeg" }); // Specify image type
        formData.append("image", blob, "image_from_url.jpg"); // Name the blob file
      } catch (err) {
        console.error("Error fetching image from URL:", err);
        alert("Failed to fetch the image from the provided URL. Please try a valid URL.");
        return;
      }
    } else {
      alert("No file or URL provided.");
      return;
    }
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/match/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data?.results) {
        setMatches(response.data.results);
        setFilteredMatches(response.data.results); // Initialize filtered matches with all results
        setShowFilters(true); // Enable filter section after getting results
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image. Please try again.");
    }
  };

  // Handle applying filters
  const applyFilters = () => {
    const filtered = matches.filter(({ product }) => {
      const isWithinCategory =
        !category || product.category.toLowerCase() === category.toLowerCase();
      const isWithinPrice =
        (!minPrice || product.price >= parseInt(minPrice)) &&
        (!maxPrice || product.price <= parseInt(maxPrice));
      return isWithinCategory && isWithinPrice;
    });
    setFilteredMatches(filtered);
  };

  return (
    <div className="file-upload-container">
      <h1>Product Matcher</h1>

      {/* File Input */}
      <div className="file-input-section">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={!!imageUrl}
        />
        {file && (
          <FaTrash
            className="delete-icon"
            onClick={deleteFile}
            title="Delete file"
          />
        )}
      </div>

      {/* URL Input */}
      <div className="url-input-section">
        <input
          type="text"
          placeholder="Enter Image URL"
          value={imageUrl}
          onChange={handleUrlChange}
          disabled={!!file}
        />
        <div className="url-trash-icon">
        {imageUrl && (
          <FaTrash
            className="delete-icon"
            onClick={deleteUrl}
            title="Delete URL"
          />
        )}
        </div>
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="preview-container">
          <h3>Image Preview</h3>
          <img src={preview} alt="Preview" className="preview-image" />
          <FaTrash
            className="delete-icon"
            onClick={deletePreview}
            title="Delete Preview"
          />
        </div>
      )}

      {/* Upload Button */}
      <button onClick={handleUpload} disabled={!file && !imageUrl}>
        Upload and Find Matches
      </button>

      {/* Filter Section */}
      {showFilters && matches.length > 0 && (
        <div className="filters-section">
          <h3>Filters</h3>
          <div className="filter-options">
            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="filter-dropdown"
            >
              <option value="">All Categories</option>
              <option value="Tops">Tops</option>
              <option value="Dresses">Dresses</option>
              <option value="Sweatshirts and Hoodies">
                Sweatshirts and Hoodies
              </option>
            </select>

            {/* Price Filters */}
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button className="apply-filters-button" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {filteredMatches.length > 0 ? (
        <div className="results-grid">
          {filteredMatches.map(({ product }, index) => (
            <div key={index} className="product-card">
              <img src={product.image_url} alt={product.name} />
              <h4>{product.name}</h4>
              <p>Price: ₹{product.price}</p>
              <p>Category: {product.category}</p>
            </div>
          ))}
        </div>
      ) : (
        matches.length > 0 && <p>No matches found for the selected filters.</p>
      )}
    </div>
  );
};

export default FileUpload;
