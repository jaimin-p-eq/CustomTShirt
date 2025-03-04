import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/apiRequest";
import ApiURLS from "../Data/ApiURLS";
import { useDispatch } from "react-redux";
import ProductList from "../Components/ProductList";
import ProductSidebar from "../Components/ProductSidebar";
import ProductTopbar from "../Components/ProductTopbar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const [filterOptions, setFilterOptions] = useState({
    Size: [],
    Sleeve: [],
    CustomizeOption: [],
    Color: [],
  });

  const dispatch = useDispatch();

  const fetchProducts = async () => {
    const response = await apiRequest(
      ApiURLS.GetAllActiveProducts.url,
      ApiURLS.GetAllActiveProducts.method,
      {},
      dispatch
    );
    setProducts(response.data);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = products.filter((product) => {
      const sizeMatch =
        filterOptions.Size.length === 0 ||
        filterOptions.Size.includes(product.Size);
      const sleeveMatch =
        filterOptions.Sleeve.length === 0 ||
        filterOptions.Sleeve.includes(product.Sleeve);
      const customizeMatch =
        filterOptions.CustomizeOption.length === 0 ||
        filterOptions.CustomizeOption.includes(product.CustomizeOption);
      const colorMatch =
        filterOptions.Color.length === 0 ||
        filterOptions.Color.includes(product.Color);

      return sizeMatch && sleeveMatch && customizeMatch && colorMatch;
    });

    filtered = filtered.sort((a, b) => {
      return sortOrder === "lowToHigh" ? a.Price - b.Price : b.Price - a.Price;
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [filterOptions, products, sortOrder]);

  return (
    <div className="flex gap-5 px-[5vw]">
      <ProductSidebar
        setFilterOptions={setFilterOptions}
        filterOptions={filterOptions}
      />
      <div className="flex-1 flex flex-col ">
        <ProductTopbar
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          count={filteredProducts.length}
        />
        <ProductList products={filteredProducts} loading={loading} />
      </div>
    </div>
  );
};

export default Products;
