import express from "express";
import { isSuperAdmin } from "../Services/IsSuperAdmin";
import ProtectedRoute from "../Services/ProtectedRoute";
import { postPackages } from "../Controller/SubScription";
const router = express.Router();

router.post("/package", ProtectedRoute, isSuperAdmin, postPackages);
