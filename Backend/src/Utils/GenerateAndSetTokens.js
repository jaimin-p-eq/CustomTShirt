import jwt from "jsonwebtoken";

export const GenerateAndSetTokens = (_id, res) => {
  const AccessToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  const RefreshToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  const Options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  res
    .cookie("RefreshToken", RefreshToken, Options)
    .cookie("AccessToken", AccessToken, Options);

  return { AccessToken, RefreshToken };
};
