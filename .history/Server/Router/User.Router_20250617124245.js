import express from "express";
import {
  getAdmins,
  getAllComplain,
  getChechAuthentication,
  getPendingAdmin,
  getSuperAdminProfile,
  loginSuperAdmin,
  LoginUser,
  LogoutUser,
  patchComplain,
  patchUpdateSuperAdminProfile,
  postComplaint,
  postNewAdmin,
  postNewUser,
  postSuperAdmin,
  profileUser,
  putUser,
  UpdateAprovedAdmin,
  updateCoverImage,
} from "../Controller/User.controller.js";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import { isSuperAdmin } from "../Services/IsSuperAdmin.js";
import { isApprovedAdmin } from "../Services/isApprovedAdmin.js";
import upload from "../Services/Multer.js";
const route = express.Router();

//user signup
route.post("/user", postNewUser);
route.put("/user", putUser);

// Super Admin
route.post("/signup/superadmin", postSuperAdmin);
route.post("/login/superadmin", loginSuperAdmin);
route.patch("/update/admin", ProtectedRoute, isSuperAdmin, UpdateAprovedAdmin);
route.get("/admins", getAdmins);
route.get("/getSuperAdmin", ProtectedRoute, isSuperAdmin, getSuperAdminProfile);
route.patch(
  "/updateSuperadmin",
  ProtectedRoute,
  isSuperAdmin,
  upload.single("image"),
  patchUpdateSuperAdminProfile
);

// admin panel
route.post("/signup", upload.single("image"), postNewAdmin);
route.get("/pending-admin", ProtectedRoute, isSuperAdmin, getPendingAdmin);
route.post("/login", LoginUser);
route.put("/profile", ProtectedRoute, isApprovedAdmin, profileUser);
route.get("/logout", ProtectedRoute, isApprovedAdmin, LogoutUser);
route.get("/check", ProtectedRoute, isApprovedAdmin, getChechAuthentication);
route.post(
  "/complaint",
  upload.single("image"),
  ProtectedRoute,
  isApprovedAdmin,
  postComplaint
);
route.get("/complaint", ProtectedRoute, isApprovedAdmin, getAllComplain);
route.patch("/complaint", ProtectedRoute, isApprovedAdmin, patchComplain);

route.post(
  "/CoverImage",
  upload.single("image"),
  ProtectedRoute,
  isApprovedAdmin,
  updateCoverImage
);

export default route;
