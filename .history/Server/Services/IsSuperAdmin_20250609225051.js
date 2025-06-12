export const isSuperAdmin = async (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ msg: "Access denied, not SuperAdmin" });
  }
  next();
};
