export const isSuperAdmin = async (req, res, next) => {
  console.log(req.user);
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ msg: "Access denied, not SuperAdmin" });
  }
  next();
};
