import Package from "../Model/Package.model";

export const postPackages = async (req, res) => {
  const { title, price, durationInDays, features } = req.body;
  console.log(title);
  if (!title || (!price && price !== 0) || !durationInDays || !features) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const Package = new Package({
      title,
      price,
      durationInDays,
      features,
    });
    await Package.save();
    res.status(201).json({ message: "Package created succussfully" });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
};
