import Package from "../Model/Package.model.js";

export const postPackages = async (req, res) => {
  const { title, price, offerPrice, durationInDays, features } = req.body;
  if (
    !title ||
    (!price && price !== 0) ||
    !durationInDays ||
    !offerPrice ||
    !features
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const packagePlan = new Package({
      title: title,
      price: price,
      offerPrice: offerPrice,
      durationInDays: durationInDays,
      features: features,
    });
    await packagePlan.save();
    res.status(201).json({ message: "Package created succussfully" });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
};

export const getPackage = async (req, res) => {
  try {
    const allPackage = await Package.find({});
    if (!allPackage || allPackage.length === 0) {
      return res.status(400).json({ content: nul });
    }
    res.status(200).json({ content: allPackage });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
};
