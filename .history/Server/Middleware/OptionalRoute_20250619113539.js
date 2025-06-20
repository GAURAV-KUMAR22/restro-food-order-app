import Admin from "../Model/Admin.model.js";
import Jwt from "jsonwebtoken";

export const OptionalRoute = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next();
  }

  try {
    const decodeUser = Jwt.verify(token, process.env.JWTSECRET);
    const user = await Admin.findById(decodeUser.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(403).json({ message: "Unauthorized", error });
  }

  next(); // Only one call to next(), after everything is done
};
