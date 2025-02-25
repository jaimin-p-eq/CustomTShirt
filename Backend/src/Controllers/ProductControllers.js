import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import ApiResponse from "../Utils/ApiResponse.js";
import deleteFiles from "../Utils/deleteFiles.js";

const AddProduct = async (req, res) => {
  try {
    const { Size, Cost, Sleeve, Stock, Color, CustomizeOption } = req.body;

    if (!req.files || req.files.length === 0) {
      return ApiResponse(res, false, null, "No images uploaded", 400);
    }

    const ImgURL = req.files.map((file) => file.path);

    const newProduct = new Product({
      ImgURL,
      Size,
      Cost,
      Sleeve,
      Stock,
      Color,
      CustomizeOption,
    });

    await newProduct.save();

    return ApiResponse(
      res,
      true,
      newProduct,
      "Product added successfully",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const FoundProduct = await Product.findById(id);

    if (!FoundProduct) {
      return ApiResponse(res, false, null, "Product not found", 400);
    }

    if (FoundProduct.ImgURL && FoundProduct.ImgURL.length > 0) {
      deleteFiles(FoundProduct.ImgURL);
    }

    await Product.findByIdAndDelete(id);

    return ApiResponse(res, true, "Product Deleted successfully", 200);
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

const GetAllCustomer = async (req, res) => {
  try {
    const { ProductId } = req.body;

    if (!ProductId) {
      return ApiResponse(res, false, null, "ProductId is required", 400);
    }

    // Ensure ProductId is correctly converted to an ObjectId using 'new'
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
      ApiResponse(res, true, result, "Customers fetched successfully");
    } else {
      ApiResponse(res, false, null, "No customers found for this product", 404);
    }
  } catch (error) {
    ApiResponse(res, false, null, `Error: ${error.message}`, 500);
  }
};

const GetAllProduct = async (req, res) => {
  try {
    const Products = await Product.find({});

    return ApiResponse(res, true, Products, "Product added successfully", 200);
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

const GetSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const singleProduct = await Product.findById(id);

    if (!singleProduct) {
      return ApiResponse(res, false, null, "Product not found", 404);
    }

    return ApiResponse(
      res,
      true,
      singleProduct,
      "Product fetched successfully",
      200
    );
  } catch (error) {
    // Handle any unexpected errors
    return ApiResponse(res, false, null, error.message, 500);
  }
};

const UpdateProduct = async (req, res) => {
  try {
    const { id, Size, Cost, Stock, Sleeve, Gender, Color } = req.body;

    const FoundProduct = await Product.findById(id);

    if (!FoundProduct) {
      return ApiResponse(res, false, null, "Product not found", 400);
    }

    if (req.files && req.files.length > 0) {
      if (FoundProduct.ImgURL && FoundProduct.ImgURL.length > 0) {
        deleteFiles(FoundProduct.ImgURL);
      }

      const ImgURL = req.files.map((file) => file.path);
      FoundProduct.ImgURL = ImgURL;
    }

    const UpdatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        Size,
        Cost,
        Sleeve,
        Stock,
        Gender,
        Color,
        ImgURL: FoundProduct.ImgURL,
      },
      { new: true }
    );

    return ApiResponse(
      res,
      true,
      UpdatedProduct,
      "Product Updated successfully",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export {
  AddProduct,
  DeleteProduct,
  GetAllCustomer,
  GetAllProduct,
  GetSingleProduct,
  UpdateProduct,
};
