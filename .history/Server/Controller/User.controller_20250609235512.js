import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/User.model.js";
import Admin from "../Model/Admin.model.js";
import Order from "../Model/Order.model.js";

export const postNewUser = async (req, res) => {
  const { name, phone, table, shopId } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (name.trim() == 0 || name.length < 1) {
    return res
      .status(400)
      .json({ message: "Name char must be more then one " });
  }

  try {
    const isExistingUser = await User.findOne({ phone });
    if (isExistingUser) {
      return res
        .status(200)
        .json({ message: "User already registered", user: isExistingUser });
    }

    const newUser = await User({
      name,
      phone,
      table,
      shopId,
    });

    const OrderDetails = await Order.findByIdAndUpdate();

    await newUser.save();
    res.status(200).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const putUser = async (req, res) => {
  let { name, phone, table } = req.body;

  phone = phone ? phone.toString().trim() : "";

  if (!name || !phone || !table) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (phone.length !== 10 || isNaN(phone)) {
    return res.status(400).json({ message: "Phone number must be 10 digits" });
  }

  try {
    // Find the existing user by phone
    const existingUser = await User.findOne({ phone });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update user fields if they are provided
    if (name) existingUser.name = name;
    if (phone) existingUser.phone = phone.trim(); // Ensure phone is trimmed
    if (table) existingUser.table = table;

    // Save the updated user
    await existingUser.save();

    res
      .status(200)
      .json({ message: "User updated successfully", user: existingUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Admin Controller
export const postNewAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.trim() == 0 || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 char long" });
    }

    const isExistingUser = await Admin.findOne({ email: email });

    if (isExistingUser) {
      return res.status(400).json({ message: "User alreday ragistered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegx.test(email)) {
      return res
        .status(400)
        .json({ message: "Email structure is not correct" });
    }

    const newUser = new Admin({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "user Ragistred Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const isExistingUser = await Admin.findOne({ email: email });
    if (!isExistingUser) {
      return res.status(400).json({ message: "User is not ragistered" });
    }
    const verifyPassword = bcrypt.compareSync(
      password,
      isExistingUser.password
    );
    if (!verifyPassword) {
      return res.status(400).json({ message: "Password is wrong" });
    }
    const payload = {
      id: isExistingUser._id,
      username: isExistingUser.username,
    };
    const token = jwt.sign(payload, process.env.JWTSECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ required on HTTPS
      sameSite: "None", // ✅ required for cross-site cookie
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res
      .status(200)
      .json({ message: "Login successfully", token, content: isExistingUser });
  } catch (error) {
    return res.status(500).json({ message: "Interal server error", error });
  }
};

export const LogoutUser = async (req, res) => {
  try {
    if (req.cookie && req.cookie.length > 2) {
      res.cookie = null;
    }
    return res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const profileUser = async (req, res) => {
  const { username, password, profilePic } = req.body;
  const { _id } = req.params;
  if ((!username && !password) || !password.trim() == 0) {
    return res.status(400).json({ message: "Only one field is required" });
  }

  const isExistingUser = await User.findOne({ _id: _id });
  if (!isExistingUser) {
    return res.status(400).json({ message: "Unouthorized User" });
  }

  const updatedContent = {};

  if (username?.trim()) {
    updatedContent.username = username.trim();
  }

  if (password?.trim) {
    const hashedPassword = await bcrypt.hash(password.trim(), 12);
    updatedContent.password = hashedPassword;
  }

  if (profilePic?.trim()) {
    updatedContent.profilePic = profilePic.trim();
  }

  if (Object.entries(updatedContent).length === 0) {
    return res.status(400).json({ message: "there is not data for updation" });
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      { _id: id },
      { $set: updatedContent }
    );
    res.status(200).json({ message: "Data has updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getChechAuthentication = async (req, res) => {
  const loginUser = req.user;
  try {
    const loginUserVerify = await Admin.findById(loginUser._id);
    if (!loginUserVerify) {
      return res.status(400).json({
        message: "User is not Authentic. Plese Signup And login first",
      });
    }
    res.status(200).json({ message: "User is Authentic" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json({ content: admins });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getPendingAdmin = async (req, res) => {
  const pendingAdmins = await Admin.find({ role: "admin", isApproved: false });
  console.log(pendingAdmins);
  if (!pendingAdmins) {
    return res.status(200).json({ content: null });
  }
  res.status(200).json({ content: pendingAdmins });
};

// SuperAdmin controller

const createToken = async (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWTSECRET,
    { expiresIn: "7d" }
  );
};

export const postSuperAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingSuperAdmin = await Admin.findOne({ email: email });

  if (existingSuperAdmin) {
    return res.status(400).json({ message: "sorry superAdmin alreday exist" });
  }

  if (!existingSuperAdmin) {
    const hashedPassword = bcrypt.hashSync(password, 12);
    const superAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: "superadmin",
      isApproved: true,
    });
    await superAdmin.save();

    const token = createToken(superAdmin);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.MODE === "Production", // ✅ only true on prod
      sameSite: process.env.MODE === "Production" ? "none" : "lax", // ✅ works both
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      msg: "SuperAdmin created",
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
      },
    });
  }
};

export const loginSuperAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  // const matchPassword = bcrypt.compareSync(password, process.env.JWTSECRET);
  // if (!matchPassword) {
  //   return res.status(400).json({ message: "password is not correct" });
  // }
  const existingSuperAdmin = Admin.findOne({ email: email });
  if (!existingSuperAdmin) {
    return res.status(400).json({ message: "superAdmin not found Try again" });
  }
  if (existingSuperAdmin) {
    const token = createToken(existingSuperAdmin);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.MODE === "Production", // ✅ only true on prod
      sameSite: process.env.MODE === "Production" ? "none" : "lax", // ✅ works both
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Logged in successfully",
      user: {
        id: existingSuperAdmin._id,
        name: existingSuperAdmin.name,
        email: existingSuperAdmin.email,
        role: existingSuperAdmin.role,
      },
    });
  }
};
