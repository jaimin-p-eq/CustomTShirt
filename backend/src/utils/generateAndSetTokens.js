import jwt from "jsonwebtoken";

export const generateAndSetTokens = (_id, res) => {
  const RefreshToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  const Options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  res.cookie("RefreshToken", RefreshToken, Options);

  return { RefreshToken };
};
