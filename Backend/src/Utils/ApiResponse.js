const ApiResponse = (res, success, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: success,
    message: message,
    data: data || null,
  });
};

export default ApiResponse;
