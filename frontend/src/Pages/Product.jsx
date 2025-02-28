import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/apiRequest";
import ApiURLS from "../Data/ApiURLS";
import { useDispatch } from "react-redux";
import { showToast } from "../Redux/toastSlice";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const fetchProducts = async () => {
    const response = await apiRequest(
      ApiURLS.GetAllActiveProducts.url,
      ApiURLS.GetAllActiveProducts.method,
      {},
      dispatch
    );

    if (response.success) {
      setProducts(response.data);
    } else {
      console.error("Error:", response.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log("products:", products);

  return (
    <div className="flex gap-5 px-[5vw]">
      <div className="w-[15vw] h-[100vh] border hidden sm:block">Sidebar</div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="flex justify-between items-center gap-5 cursor-pointer w-full">
          <h1 className="text-xl font-bold">{`${products.length} Products`}</h1>
          <input type="text" />
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : products.length > 0 ? (
          <div className="flex flex-wrap justify-center items-center  sm:justify-between">
            {products.map((product) => (
              <div key={product._id} className="border p-2 rounded-md my-2">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${product.ImgURL[0]}`}
                  alt={product.name}
                  className="w-[200px] h-[200px]"
                />
                <div>
                  <div>desc: {product.description}</div>
                  <div>Price: {product.Price}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Product;
