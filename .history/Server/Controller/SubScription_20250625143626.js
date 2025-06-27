export const postPackages = (req, res) => {
  const { title, price, durationInDays, features } = req.body;
  if (!title || !price || !durationInDays || !features) {
    return res.status(400).json({ message: "All fields are required" });
  }
};
