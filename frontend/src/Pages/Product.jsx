import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../utils/apiRequest";
import ApiURLS from "../Data/ApiURLS";
import { useDispatch } from "react-redux";
import ProductImages from "../Components/ProductImages";
import { MdSecurity } from "react-icons/md";
import { TbTruckDelivery, TbReplace } from "react-icons/tb";
import { Button } from "@mui/material";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [inStock, setInStock] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [warning, setWarning] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiRequest(
          `${ApiURLS.GetSingleProduct.url}/${id}`,
          ApiURLS.GetSingleProduct.method,
          {},
          dispatch
        );
        setProduct(response.data);
        setInStock(response.data.Stock > 0);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };

    fetchProduct();
  }, [id, dispatch]);

  const increaseQuantity = () => {
    if (quantity < product.Stock) {
      setQuantity(quantity + 1);
      setWarning("");
    } else {
      setWarning("Max Quantity is reached");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-12 p-4">
      <div className="flex flex-col sm:flex-row gap-10 justify-center">
        <ProductImages imgs={product.ImgURL} />
        <div className="product-data space-y-4">
          <div>
            {product.DiscountedPrice ? (
              <div>
                <p className="text-lg font-bold">
                  Price: <del className="text-red-500">{product.Price}</del>
                </p>
                <p className="text-xl font-semibold text-blue-600">
                  Deal of the Day: {product.DiscountedPrice}
                </p>
              </div>
            ) : (
              <p className="text-xl font-semibold text-blue-600">
                Price: {product.Price}
              </p>
            )}
          </div>
          <p className="text-md">Size: {product.Size}</p>
          <p className="text-md">Sleeve: {product.Sleeve}</p>
          <h1>Benifites :</h1>
          <div className="border-b border-gray-300 pb-4 flex gap-5">
            {/* <div className="text-center">
              <TbTruckDelivery className="text-5xl mx-auto bg-gray-200 p-2 rounded-full" />
              <p>Free Delivery</p>
            </div> */}
            <div className="text-center">
              <TbReplace className=" text-5xl mx-auto bg-gray-200 p-2 rounded-full" />
              <p>7 Days Replacement</p>
            </div>
            {/* <div className="text-center">
              <MdSecurity className=" text-5xl mx-auto bg-gray-200 p-2 rounded-full" />
              <p>6 Month Warranty</p>
            </div> */}
          </div>
          <div className=" text-lg space-y-2">
            <p>
              Available:{" "}
              <span className="font-semibold">
                {inStock ? "In Stock" : "Not Available"}
              </span>
            </p>
            <p>
              ID: <span className="font-semibold">{id}</span>
            </p>
          </div>
          <hr className="border-black w-5/6" />
          <div className="flex items-center space-x-4">
            <p className="text-lg">Quantity:</p>
            <Button
              onClick={decreaseQuantity}
              className="bg-gray-300 px-3 py-1 rounded-md"
            >
              -
            </Button>
            <span className="text-lg">{quantity}</span>
            <Button
              onClick={increaseQuantity}
              className="bg-gray-300 px-3 py-1 rounded-md"
            >
              +
            </Button>
          </div>
          {warning && <p className="text-red-500">{warning}</p>}
          <div className="flex flex-wrap justify-center items-center gap-2">
            <Button variant="contained">Customize</Button>
            <Button variant="contained">Buy Now</Button>
            <Button variant="contained">Add To Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
