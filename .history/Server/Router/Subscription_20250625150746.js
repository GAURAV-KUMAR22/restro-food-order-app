import express from "express";
import { isSuperAdmin } from "../Services/IsSuperAdmin.js";
import ProtectedRoute from "../Services/ProtectedRoute.js";
import { postPackages } from "../Controller/SubScription.js";
const router = express.Router();

router.post("/package", ProtectedRoute, isSuperAdmin, postPackages);
