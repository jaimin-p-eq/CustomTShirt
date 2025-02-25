const ApiURLS = {
  // User

  // Registration
  Register: "/api/user/register",
  VerifyUser: "/api/user/verify-user",
  UpdateUser: "/api/user/update-user",

  // Login
  Login: "/api/user/login",
  Logout: "/api/user/logout",
  SendingMailForLoginUser: "/api/user/sending-mail-for-login",
  RefreshAccessToken: "/api/user/refresh-tokens",

  // Admin Requests
  GetSingleUser: (id) => `/api/user/single-user/${id}`,
  DeleteUser: (id) => `/api/user/delete/${id}`,
  GetAllOwnOrder: "/api/user/get-all-own-orders",

  // Customization Options
  AddCustomizationOptions:
    "/api/customization-options/add-customization-options",
  DeleteCustomizationOptions:
    "/api/customization-options/delete/delete-customization-options",
  GetCustomizationOptions:
    "/api/customization-options/get-customization-options",

  // Order
  InitiateOrder: "/api/order/initiate-order",
  AddToCartOrder: "/api/order/add-to-cart-order",
  GetAllCartOrder: "/api/order/get-cart-order",
  CartToOrder: "/api/order/cart-to-order",
  AddOrder: "/api/order/add-order",
  UpdateOrderStatus: (id) => `/api/order/update-state/${id}`,
  GetSingleOrder: (id) => `/api/order/single-order/${id}`,
  GetAllOrder: "/api/order/get-all-orders",

  // Product
  AddProduct: "/api/product/add-product",
  UpdateProduct: "/api/product/update-product",
  DeleteProduct: (id) => `/api/product/delete/${id}`,
  GetSingleProduct: (id) => `/api/product/single-product/${id}`,
  GetAllProduct: "/api/product/get-all-products",
  GetAllCustomer: "/api/product/get-all-customers",
};

export default ApiURLS;
