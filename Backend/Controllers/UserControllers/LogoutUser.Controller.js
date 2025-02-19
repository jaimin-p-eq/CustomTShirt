import ApiResponse from "../../Utils/ApiResponse.js";

const LogoutUser = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .clearCookie("AccessToken", options)
      .clearCookie("RefreshToken", options);

    return ApiResponse(res, true, null, "User is succesfully Logout", 200);
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default LogoutUser;
