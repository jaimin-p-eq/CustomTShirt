import axios from "axios";
import { showToast } from "../Redux/toastSlice";

export const apiRequest = async (url, method, data = {}, dispatch) => {
  console.log(`${import.meta.env.VITE_BASE_URL}${url}`);

  try {
    const response = await axios({
      url: `${import.meta.env.VITE_BASE_URL}${url}`,
      method,
      data: Object.keys(data).length ? data : undefined,
    });

    console.log("API Response:", response);

    if (response.data.success) {
      dispatch(
        showToast({
          message: response.data.message || "Request successful",
          variant: "success",
        })
      );
      return { success: true, data: response.data.data };
    } else {
      throw new Error(response.data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("API Error:", error);

    const errorMessage =
      error?.response?.data?.message || "Something went wrong";

    if (dispatch) {
      dispatch(
        showToast({
          message: errorMessage,
          variant: "error",
        })
      );
    }

    return { success: false, data: null, message: errorMessage };
  }
};
