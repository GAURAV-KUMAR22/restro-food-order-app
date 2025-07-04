import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/User.model.js";
import Admin from "../Model/Admin.model.js";
import Order from "../Model/Order.model.js";
import Complain from "../Model/Complain.model.js";
import e, { json } from "express";
import VisitorInfo from "../Model/VisitorInfo.model.js";

// User Api
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
export const getAdminProfile = async (req, res) => {
  const { id } = req.query;
  const adminProfle = await Admin.findOne({ _id: id });
  if (!adminProfle || adminProfle.length === 0) {
    return res.status(400);
  }
  res.status(200).json({ content: adminProfle });
};

export const postNewAdmin = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const image = req.file.filename;
    if (!name || !email || !password || !address || !phone || !image) {
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
      avatar: image,
      address: address,
      phone: phone,
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

    const data = {
      isApproved: isExistingUser.isApproved,
      subscribe:isExistingUser.subscription
      user: {
        _id: isExistingUser._id,
        name: isExistingUser.name,
        coverImage: isExistingUser.coverImage,
      },
      role: isExistingUser.role,
    };

    res.status(200).json({
      message: "Login successfully",
      token,
      content: data,
    });
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
  const { token } = req.cookies;
  try {
    const loginUserVerify = await Admin.findById(loginUser._id);
    if (!loginUserVerify) {
      return res.status(400).json({
        message: "User is not Authentic. Plese Signup And login first",
      });
    }
    res.status(200).json({ message: "User is Authentic", token: token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({
      isApproved: true,
      isActive: true,
    }).select("-password");
    res.status(200).json({ content: admins });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};
export const getPendingAdmin = async (req, res) => {
  try {
    const pendingAdmins = await Admin.find({
      isApproved: false,
      isActive: true,
    });

    if (pendingAdmins.length === 0) {
      return res
        .status(200)
        .json({ content: [], message: "No pending admins found" });
    }

    res.status(200).json({ content: pendingAdmins });
  } catch (error) {
    console.error("Error fetching pending admins:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// SuperAdmin controller
// ✅ Token function (no async needed)
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWTSECRET, // ✅ consistent name
    { expiresIn: "7d" }
  );
};

export const postSuperAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingSuperAdmin = await Admin.findOne({ email });

  if (existingSuperAdmin) {
    return res.status(400).json({ message: "SuperAdmin already exists" });
  }

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
    secure: process.env.MODE === "Production",
    sameSite: process.env.MODE === "Production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
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
};

export const loginSuperAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingSuperAdmin = await Admin.findOne({ email });
  if (!existingSuperAdmin) {
    return res.status(400).json({ message: "SuperAdmin not found" });
  }

  const isMatch = await bcrypt.compare(password, existingSuperAdmin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = createToken(existingSuperAdmin);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.MODE === "Production",
    sameSite: process.env.MODE === "Production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({
    msg: "Login successful",
    token: token,
    user: {
      id: existingSuperAdmin._id,
      name: existingSuperAdmin.name,
      email: existingSuperAdmin.email,
      role: existingSuperAdmin.role,
      imageUrl: existingSuperAdmin.avatar,
    },
  });
};

export const UpdateAprovedAdmin = async (req, res) => {
  const { _id, status } = req.body;

  if (!_id || !status) {
    return res.status(400).json({ message: "Id and status are required" });
  }

  try {
    const existingAdmin = await Admin.findById(_id);

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (status === "approved") {
      existingAdmin.isApproved = true;
      existingAdmin.isActive = true;
    } else {
      existingAdmin.isApproved = false;
      existingAdmin.isActive = false;
    }

    await existingAdmin.save(); // ✅ await here

    res.status(200).json({ message: "Admin status updated successfully" });
  } catch (error) {
    console.error("Error in UpdateAprovedAdmin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const SuperAdminProfile = async (req, res) => {
  const superAdmin = req.user;
  if (superAdmin.role === "superadmin") {
    res.status(200).json({ content: superAdmin });
  }
};

export const getSuperAdminProfile = async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    return res.status(401).json({ message: "Invalid request" });
  }
  try {
    const superad = await Admin.find({ _id }).select("-password");
    if (superad.length === 0) {
      return res.status(404).json({ message: "superAdmin not found" });
    }

    res.status(200).json({ content: superad });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const patchUpdateSuperAdminProfile = async (req, res) => {
  const { name, password, phone } = req.body;

  const image = req?.file?.filename;
  // ✅ Correctly get _id from req.user
  const _id = req.user?._id;
  const role = req.user?.role;

  if (!role || role !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Access denied. Not a superadmin." });
  }

  if (!_id) {
    return res.status(401).json({ message: "Unauthorized: Missing user ID" });
  }

  try {
    const superAdmin = await Admin.findOne({ _id });

    if (!superAdmin) {
      return res.status(404).json({ message: "SuperAdmin not found" });
    }

    // ✅ Update fields if they exist
    if (name) superAdmin.name = name;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 15); // ⏳ Await here
      superAdmin.password = hashedPassword;
    }

    if (phone) superAdmin.phone = phone;

    if (image) superAdmin.avatar = image;

    await superAdmin.save();

    res.status(200).json({ message: "SuperAdmin successfully updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Complaint Api
export const postComplaint = async (req, res) => {
  const { subject, complain } = req.body;
  const snapShot = req.file.filename;
  const { _id } = req.user;
  if (!subject || !complain || !snapShot) {
    return res.status(400);
  }

  const complaint = new Complain({
    adminId: _id,
    subject: subject,
    snapshot: snapShot,
    complainDetail: complain,
  });
  await complaint.save();
  res
    .status(201)
    .json({ message: "complaint reased successfully", content: complain });
};

export const getAllComplain = async (req, res) => {
  const { _id } = req.user;
  if (!_id && req.user.role !== "superadmin") {
    return res.status(404);
  }

  try {
    const allComplaint = await Complain.find({ resolve: false }).populate(
      "adminId"
    );
    if (allComplaint.length === 0) {
      return res.status(404);
    }
    res.status(200).json({ content: allComplaint });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const patchComplain = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Complaint ID is required" });
  }

  try {
    const existingComplain = await Complain.findOne({ _id: id }); // _id instead of id

    if (!existingComplain) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    existingComplain.resolve = true;
    await existingComplain.save();

    res.status(200).json({ message: "Complaint resolved successfully" });
  } catch (error) {
    console.error("Error resolving complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Profile Routes

export const updateCoverImage = async (req, res) => {
  const { _id } = req.user;
  const coverImage = req.file.filename;

  if (!_id || !coverImage) {
    return res.status(404);
  }
  try {
    const existingAdmin = await Admin.findOne({ _id });
    if (!existingAdmin) {
      return res.status(404);
    }

    existingAdmin.coverImage = coverImage;
    await existingAdmin.save();
    res.status(200).json({
      message: "Cover image updated successfully",
      content: { coverImage: existingAdmin.coverImage },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCoverImage = async (req, res) => {
  const shopId = req.query.paramsId;
  if (!shopId) {
    return res.status(400).json({ message: "shopId is required" });
  }
  try {
    const adminCoverIimage = await Admin.findOne({ _id: shopId });
    if (!adminCoverIimage) {
      return res.status(400).json({ message: "shopId did not found" });
    }

    const coverImage = { coverImage: adminCoverIimage.coverImage };
    res.status(200).json({ content: coverImage });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const postVisitorinfo = async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const data = {
      ip,
      ...req.body,
    };
    // Save to DB (MongoDB, PostgreSQL, etc.)
    await VisitorInfo.create(data);

    res.status(200).json({ message: "Visitor logged" });
  } catch (error) {
    console.error("Visitor log error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getVisitorInfo = async (req, res) => {
  try {
    const visitorInfo = await VisitorInfo.find({}).sort({ visitedAt: -1 });
    const uniqueIPs = await VisitorInfo.distinct("ip");
    if (!visitorInfo || visitorInfo.length === 0) {
      return res.status(400).json({ content: null });
    }

    let mobileCount = 0;
    let tabletCount = 0;
    let laptopCount = 0;
    let desktopCount = 0;

    // Count each visitor device type
    for (const visitor of visitorInfo) {
      const screenWidth = visitor.screen?.width || 0;

      if (screenWidth < 768) {
        mobileCount++;
      } else if (screenWidth < 1024) {
        tabletCount++;
      } else if (screenWidth < 1536) {
        laptopCount++;
      } else {
        desktopCount++;
      }
    }

    const data = {
      totalUniqueVisitors: uniqueIPs.length,
      totalVisits: visitorInfo.length,
      devices: {
        mobile: mobileCount,
        tablet: tabletCount,
        laptop: laptopCount,
        desktop: desktopCount,
      },
      lastVisit: visitorInfo[0]?.visitedAt?.toISOString() || null,
    };

    res.status(200).json({ content: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSuspendedAdmin = async (req, res) => {
  try {
    const suspendedAdmins = await Admin.find({
      isApproved: false,
      isActive: false,
    });
    if (!suspendedAdmins || suspendedAdmins.length === 0) {
      return res.status(404).json({ content: null });
    }
    res.status(200).json({ content: suspendedAdmins });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
