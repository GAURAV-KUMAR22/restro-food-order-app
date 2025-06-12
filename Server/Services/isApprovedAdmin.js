import Admin from "../Model/Admin.model.js";

export const isApprovedAdmin = async (req, res, next) => {
  const user = await Admin.findById(req.user.id);
  if (user.role === "admin" && !user.isApproved) {
    return res.status(403).json({ msg: "Admin not approved yet" });
  }
  next();
};
