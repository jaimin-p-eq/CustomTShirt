import React, { useEffect, useState } from "react";

const ProductImages = ({ imgs }) => {
  const [mainImage, setMainImage] = useState(imgs[0]);

  return (
    <section className="">
      <div className="flex-1">
        <img
          src={`${import.meta.env.VITE_BASE_URL}${mainImage}`}
          alt="Main product"
          className="h-[350px] w-[450px] sm:h-[60vh] rounded-lg shadow-lg"
        />
      </div>
      <div className="flex gap-2 mt-2 justify-center">
        {imgs.length > 1 &&
          imgs.map((img, index) => (
            <img
              key={index}
              src={`${import.meta.env.VITE_BASE_URL}${img}`}
              alt={`Thumbnail ${index}`}
              className={`w-20 h-20 object-cover cursor-pointer border-2 rounded-md transition-all hover:opacity-75 ${
                mainImage === img ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
      </div>
    </section>
  );
};

export default ProductImages;
