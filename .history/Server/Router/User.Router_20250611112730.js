import express from "express";
import {
  getAdmins,
  getChechAuthentication,
  getPendingAdmin,
  loginSuperAdmin,
  LoginUser,
  LogoutUser,
  postNewAdmin,
  postNewUser,
  postSuperAdmin,
  profileUser,
  putUser,
  UpdateAprovedAdmin,
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
route.get("/admins", ProtectedRoute, isSuperAdmin, getPendingAdmin);
route.patch("/update/admin", ProtectedRoute, isSuperAdmin, UpdateAprovedAdmin);

// admin panel
route.post("/signup", upload.single("image"), postNewAdmin);
route.get("/pending-admin", ProtectedRoute, isSuperAdmin, getPendingAdmin);
route.post("/login", LoginUser);
route.put("/profile", ProtectedRoute, isApprovedAdmin, profileUser);
route.get("/logout", ProtectedRoute, isApprovedAdmin, LogoutUser);
route.get("/check", ProtectedRoute, isApprovedAdmin, getChechAuthentication);

export default route;
