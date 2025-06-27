import express from "express";
import { isSuperAdmin } from "../Services/IsSuperAdmin";
import ProtectedRoute from "../Services/ProtectedRoute";
const router = express.Router();

router.post("/package", ProtectedRoute, isSuperAdmin, postPackages);
