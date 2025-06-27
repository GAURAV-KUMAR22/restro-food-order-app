import Package from "../Model/Package.model.js";

export const postPackages = async (req, res) => {
  const { title, price, offerPrice, durationInDays, features } = req.body;
  console.log(title, price, offerPrice, durationInDays, features);
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
