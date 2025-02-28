import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiURLS from "../Data/ApiURLS";
import { apiRequest } from "../utils/apiRequest";
import { showToast } from "../Redux/toastSlice";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    Size: "M",
    Price: "",
    DiscountedPrice: "",
    Sleeve: "full sleeve",
    Stock: "",
    Color: "",
    CustomizeOption: "Photo",
    ProductImages: [],
  });
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  console.log(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, ProductImages: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "ProductImages") {
        Array.from(formData.ProductImages).forEach((file) => {
          data.append("ProductImages", file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    const { url, method } = ApiURLS.AddProduct;
    const response = await apiRequest(url, method, data, dispatch);

    if (response.success) {
      dispatch(showToast({ message: response.message, variant: "success" }));
      setFormData({
        Size: "M",
        Price: "",
        DiscountedPrice: "",
        Sleeve: "full sleeve",
        Stock: "",
        Color: "",
        CustomizeOption: "Photo",
        ProductImages: [],
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Product</h2>
      <div className="grid grid-cols-1 gap-4">
        <label className="text-gray-700">Size</label>
        <select
          name="Size"
          value={formData.Size}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          {["XXL", "XL", "L", "M", "S"].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="Price"
          value={formData.Price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="number"
          name="DiscountedPrice"
          value={formData.DiscountedPrice}
          onChange={handleChange}
          placeholder="Discounted Price"
          className="w-full p-2 border border-gray-300 rounded"
        />

        <label className="text-gray-700">Sleeve</label>
        <select
          name="Sleeve"
          value={formData.Sleeve}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          {["full sleeve", "half sleeve", "sleeveless"].map((sleeve) => (
            <option key={sleeve} value={sleeve}>
              {sleeve}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="Stock"
          value={formData.Stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="text"
          name="Color"
          value={formData.Color}
          onChange={handleChange}
          placeholder="Color"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <label className="text-gray-700">Customize Option</label>
        <select
          name="CustomizeOption"
          value={formData.CustomizeOption}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          {["Photo", "Text", "Both"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept="image/*"
          className="file-input file-input-bordered w-full"
        />

        <button
          type="submit"
          className="mt-4 btn btn-primary w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
        >
          Add Product
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
