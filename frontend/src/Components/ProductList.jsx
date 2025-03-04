import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";

const ProductList = ({ products, loading }) => {
  const navigate = useNavigate();

  const redirectToPage = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <div className="flex flex-wrap justify-center items-center sm:justify-normal gap-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-2 rounded-md my-2 cursor-pointer"
              onClick={() => redirectToPage(product._id)}
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}${product.ImgURL[0]}`}
                alt={product.name}
                className="w-[200px] h-[200px]"
              />
              <div>
                {product.DiscountedPrice ? (
                  <div className="flex">
                    <p className="flex items-center">
                      <p className="font-bold flex items-center">
                        <FaRupeeSign /> {product.DiscountedPrice}{" "}
                      </p>
                      <del className="pl-2"> {product.Price}</del>
                    </p>
                  </div>
                ) : (
                  <p className="flex font-bold items-center">
                    <FaRupeeSign />
                    {product.Price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductList;
