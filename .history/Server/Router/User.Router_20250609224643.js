import express from "express";
import {
  getAdmins,
  getChechAuthentication,
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
const route = express.Router();

//user signup
route.post("/user", postNewUser);
route.put("/user", putUser);

// Super Admin
route.post("/signup/superadmin", postSuperAdmin);
route.post("/login/superadmin", loginSuperAdmin);

// admin panel
route.post("/signup", postNewAdmin);
route.post("/login", LoginUser);
route.put("/profile", ProtectedRoute, profileUser);
route.get("/logout", ProtectedRoute, LogoutUser);
route.get("/check", ProtectedRoute, getChechAuthentication);

route.get("/admins", getAdmins);

export default route;
