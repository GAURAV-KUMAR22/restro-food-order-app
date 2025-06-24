import jwt from "jsonwebtoken";
import Admin from "../Model/Admin.model.js";
import User from "../Model/User.model.js";

const ProtectedRoute = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      return res.status(401).json({ message: "No access token" });
    }
    const decodeUser = jwt.verify(token, process.env.JWTSECRET);
    const user = await Admin.findById(decodeUser.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(403).json({ message: "Unauthorized", error });
  }
};

export default ProtectedRoute;
