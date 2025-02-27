import mongoose from "mongoose";
import Product from "../models/productModel.js";
import apiResponse from "../Utils/apiResponse.js";
import deleteFiles from "../Utils/deleteFiles.js";
import path from "path";

const addProduct = async (req, res) => {
  try {
    const {
      Size,
      Price,
      DiscountedPrice,
      Sleeve,
      Stock,
      Color,
      CustomizeOption,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return apiResponse(res, false, null, "No images uploaded", 400);
    }

    const ImgURL = req.files.map(
      (file) => `/uploads/${path.basename(file.path)}`
    );

    const newProduct = new Product({
      ImgURL,
      Size,
      Price,
      DiscountedPrice,
      Sleeve,
      Stock,
      Color,
      CustomizeOption,
    });

    await newProduct.save();

    return apiResponse(
      res,
      true,
      newProduct,
      "Product added successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id, Size, Price, DiscountedPrice, Stock, Sleeve, Gender, Color } =
      req.body;

    const FoundProduct = await Product.findById(id);

    if (!FoundProduct) {
      return apiResponse(res, false, null, "Product not found", 400);
    }

    if (req.files && req.files.length > 0) {
      if (FoundProduct.ImgURL && FoundProduct.ImgURL.length > 0) {
        deleteFiles(FoundProduct.ImgURL);
      }

      const ImgURL = req.files.map(
        (file) => `/uploads/${path.basename(file.path)}`
      );
      FoundProduct.ImgURL = ImgURL;
    }

    const UpdatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        Size,
        Price,
        DiscountedPrice,
        Sleeve,
        Stock,
        Gender,
        Color,
        ImgURL: FoundProduct.ImgURL,
      },
      { new: true }
    );

    return apiResponse(
      res,
      true,
      UpdatedProduct,
      "Product Updated successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const { ProductId } = req.body;

    if (!ProductId) {
      return apiResponse(res, false, null, "ProductId is required", 400);
    }

    const productObjectId = new mongoose.Types.ObjectId(ProductId);

    const pipeline = [
      {
        $match: {
          ProductId: productObjectId,
        },
      },
      {
        $sort: {
          orderDate: -1,
        },
      },
      {
        $project: {
          CustomerId: 1,
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    if (result.length > 0) {
      apiResponse(res, true, result, "Customers fetched successfully");
    } else {
      apiResponse(res, false, null, "No customers found for this product", 404);
    }
  } catch (error) {
    apiResponse(res, false, null, `Error: ${error.message}`, 500);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const Products = await Product.find();

    return apiResponse(
      res,
      true,
      Products,
      "Products fetched successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};
const getAllActiveProducts = async (req, res) => {
  try {
    const Products = await Product.find({ isDiscontinued: false });

    return apiResponse(
      res,
      true,
      Products,
      "Products fetched successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const singleProduct = await Product.findById(id);

    if (!singleProduct) {
      return apiResponse(res, false, null, "Product not found", 404);
    }

    return apiResponse(
      res,
      true,
      singleProduct,
      "Product fetched successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const disContinueProducts = async (req, res) => {
  try {
    const { Products } = req.body;

    for (const productId of Products) {
      const FoundProduct = await Product.findById(productId);
      if (!FoundProduct) {
        return apiResponse(
          res,
          false,
          null,
          `Product ${productId} not found`,
          400
        );
      }

      FoundProduct.isDiscontinued = true;
      await FoundProduct.save();
    }

    return apiResponse(
      res,
      true,
      null,
      "Products are discontinued successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const reContinueProducts = async (req, res) => {
  try {
    const { Products } = req.body;

    for (const productId of Products) {
      const FoundProduct = await Product.findById(productId);
      if (!FoundProduct) {
        return apiResponse(
          res,
          false,
          null,
          `Product ${productId} not found`,
          400
        );
      }

      FoundProduct.isDiscontinued = false;
      await FoundProduct.save();
    }

    return apiResponse(
      res,
      true,
      null,
      "Products are discontinued successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const { Stock } = req.body;

    if (!Stock) {
      return apiResponse(res, false, null, "Stock value is required", 400);
    }

    const Products = await Product.find({
      Stock: { $lt: Stock },
      isDiscontinued: false,
    });

    if (Products.length === 0) {
      return apiResponse(
        res,
        false,
        [],
        "No products found with stock less than " + Stock,
        404
      );
    }

    return apiResponse(
      res,
      true,
      Products,
      "Products retrieved successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

export {
  addProduct,
  getAllCustomers,
  getAllProducts,
  getAllActiveProducts,
  getSingleProduct,
  updateProduct,
  disContinueProducts,
  reContinueProducts,
  getLowStockProducts,
};
