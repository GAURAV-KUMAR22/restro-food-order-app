export const EnsureIsApproved = async (req, res) => {
  const admin = req.user;
  if (!admin) {
    return res.status(400).json({ message: "admin is not exist" });
  }

  if(admin.role ==='admin' && admin.isApproved ===false){
    return res.status(400).json()
  }
};
