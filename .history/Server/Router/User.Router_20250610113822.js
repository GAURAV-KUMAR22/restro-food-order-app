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
} from "../Controller/User.controller.js";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import { isSuperAdmin } from "../Services/IsSuperAdmin.js";
import { isApprovedAdmin } from "../Services/isApprovedAdmin.js";
const route = express.Router();

//user signup
route.post("/user", postNewUser);
route.put("/user", putUser);

// Super Admin
route.post("/signup/superadmin", postSuperAdmin);
route.post("/login/superadmin", loginSuperAdmin);
route.get("/admins", getAdmins);

// admin panel
route.post("/signup", postNewAdmin);
route.get("/pending-admin", ProtectedRoute, isSuperAdmin, getPendingAdmin);
route.post("/login", ProtectedRoute, isApprovedAdmin, LoginUser);
route.put("/profile", ProtectedRoute, isApprovedAdmin, profileUser);
route.get("/logout", ProtectedRoute, isApprovedAdmin, LogoutUser);
route.get("/check", ProtectedRoute, isApprovedAdmin, getChechAuthentication);


export default route;
