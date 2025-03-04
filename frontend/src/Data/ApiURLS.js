const ApiURLS = {
  // User
  Login: { url: "/api/user/login", method: "POST" },
  Register: { url: "/api/user/register", method: "POST" },
  ActivateUser: { url: "/api/user/activate-user", method: "POST" },
  SendingMailForLogin: {
    url: "/api/user/sending-mail-for-login",
    method: "POST",
  },
  ForgotPasswordMail: {
    url: "/api/user/sending-mail-for-forgot-password",
    method: "POST",
  },
  ForgotPassword: { url: "/api/user/forgot-password", method: "POST" },
  GetSingleUser: { url: "/api/user/single-user/:id", method: "GET" },
  MakeAdmin: { url: "/api/user/make-admin/:id", method: "PATCH" },
  BlockUsers: { url: "/api/user/block-users", method: "PATCH" },
  UnblockUsers: { url: "/api/user/unblock-users", method: "PATCH" },
  UpdateUser: { url: "/api/user/update-user", method: "PUT" },
  DeleteUser: { url: "/api/user/delete", method: "DELETE" },
  Logout: { url: "/api/user/logout", method: "POST" },
  GetAllOwnOrders: { url: "/api/user/get-all-own-orders", method: "GET" },

  // Product
  AddProduct: { url: "/api/product/add-product", method: "POST" },
  UpdateProduct: { url: "/api/product/update-product", method: "PUT" },
  DeleteProduct: { url: "/api/product/delete", method: "DELETE" },
  DiscontinueProducts: {
    url: "/api/product/discontinue-products",
    method: "PATCH",
  },
  RecontinueProducts: {
    url: "/api/product/recontinue-products",
    method: "PATCH",
  },
  GetLowStockProducts: {
    url: "/api/product/get-low-stock-products",
    method: "GET",
  },
  GetSingleProduct: { url: "/api/product/single-product", method: "GET" },
  GetAllProduct: { url: "/api/product/get-all-products", method: "GET" },
  GetAllActiveProducts: {
    url: "/api/product/get-all-active-products",
    method: "GET",
  },
  GetAllCustomers: { url: "/api/product/get-all-customers", method: "GET" },

  // Order
  InitiateOrder: { url: "/api/order/initiate-order", method: "POST" },
  AddToCartOrder: { url: "/api/order/add-to-cart-order", method: "POST" },
  GetCartOrder: { url: "/api/order/get-cart-order", method: "GET" },
  CartToOrder: { url: "/api/order/cart-to-order", method: "POST" },
  AddOrder: { url: "/api/order/add-order", method: "POST" },
  UpdateOrderStatus: { url: "/api/order/update-state/:id", method: "PATCH" },
  GetSingleOrder: { url: "/api/order/single-order/:id", method: "GET" },
  GetAllOrders: { url: "/api/order/get-all-orders", method: "GET" },

  // Customization Options
  AddCustomizationOptions: {
    url: "/api/customization-options/add-customization-options",
    method: "POST",
  },
  DeleteCustomizationOptions: {
    url: "/api/customization-options/delete/delete-customization-options",
    method: "DELETE",
  },
  GetCustomizationOptions: {
    url: "/api/customization-options/get-customization-options",
    method: "GET",
  },
};

export default ApiURLS;
