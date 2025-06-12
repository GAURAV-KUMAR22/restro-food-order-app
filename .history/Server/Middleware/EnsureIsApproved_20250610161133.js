export const EnsureIsApproved = async (req, res, next) => {
  const admin = await req.user;
  if (!admin) {
    return res.status(400).json({ message: "admin is not exist" });
  }

  if (admin.role === "admin" && admin.isApproved === false) {
    return res.status(404).json({ message: "Invalid user" });
  }
  next();
};
