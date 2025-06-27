import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./Db/MongoDb.js";
import AuthRoutes from "./Router/User.Router.js";
import ProductsRoute from "./Router/Products.Router.js";
import CartRoutes from "./Router/Cart.router.js";
import OrderRoutes from "./Router/Order.route.js";
import SalesRouter from "./Router/Sales.router.js";
import PaymentRouter from "./Router/Payment.router.js";
import SubScriptionRouter from "./Router/Subscription.js";
import { fileURLToPath } from "url";
import path from "path";
import "./Services/Cron/Resetqty.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import socketIo from "./Socket/Socket.js";
import helmet from "helmet";
import compression from "compression";
import ProtectedRoute from "./Services/ProtectedRoute.js";
import "./Services/Cron/Resetqty.js";

import "./Services/Cron/Resetqty.js";

const __Filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__Filename);

const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  })
);

app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    return false;
  }
  return compression.filter(req, res);
}
console.log(
  process.env.MODE === "Production"
    ? process.env.FRONTEND_PROD
    : process.env.FRONTEND_DEV
);
app.use(
  cors({
    origin:
      process.env.MODE === "Production"
        ? process.env.FRONTEND_PROD
        : process.env.FRONTEND_DEV,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.MODE === "Production"
        ? process.env.FRONTEND_PROD
        : process.env.FRONTEND_DEV,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
socketIo(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "/uploads")));

db();
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/products", ProductsRoute);
app.use("/api/v1/carts", CartRoutes);
app.use("/api/v1/orders", OrderRoutes);
app.use("/api/v1/sales", SalesRouter);
app.use("/api/v1/subscription", SubScriptionRouter);
app.use("/api/v1/payment", PaymentRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // Pass to default handler if response already sent
  }

  console.error("❌ Error caught by middleware:", err);

  res.status(500).json({
    message: "Internal Server Error",
    error: err.message || "Unexpected error",
  });
});

server.listen(5000, () => console.log("server connected 5000"));
